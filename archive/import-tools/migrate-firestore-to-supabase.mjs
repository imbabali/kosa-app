/**
 * Migration: Firestore (kosa05-repository) → Supabase (kosa-app)
 *
 * For each existing Firestore profile we:
 *   1. Create a Supabase auth user by email (idempotent — skip if exists)
 *   2. The on_auth_user_created trigger inserts a public.profiles row
 *   3. We then UPDATE that profile with all the data we have from Firestore
 *
 * Idempotent — safe to re-run. Existing Supabase profiles are not overwritten;
 * only blank fields get filled.
 *
 * Required env vars (from .env.local at project root):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Required ADC (gcloud auth application-default login --project kosa05-repository)
 *
 * Usage:
 *   node migrate-firestore-to-supabase.mjs              # dry run
 *   node migrate-firestore-to-supabase.mjs --commit     # actually write
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';

const COMMIT = process.argv.includes('--commit');
const PROJECT_ROOT = path.resolve(import.meta.dirname, '../..');
const ENV_LOCAL = path.join(PROJECT_ROOT, '.env.local');

// Load .env.local
const env = {};
for (const line of readFileSync(ENV_LOCAL, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.+)$/);
  if (m) env[m[1]] = m[2];
}
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

// Init Firestore (Firebase Admin via ADC)
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'kosa05-repository',
});
const fs = admin.firestore();

// Init Supabase (service role bypasses RLS)
const supa = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log(`Reading Firestore members from kosa05-repository...`);
const snap = await fs.collection('members').get();
const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
console.log(`Found ${docs.length} Firestore documents.`);

const norm = (e) => (e || '').trim().toLowerCase();
const blank = (v) => v == null || String(v).trim() === '';
const clean = (v) => (v == null ? null : String(v).trim() || null);

let created = 0;
let updated = 0;
let skipped = 0;
let errors = 0;

for (const d of docs) {
  const email = norm(d.email || d.userEmail);
  if (!email) {
    console.log(`  SKIP: no email on ${d.id}`);
    skipped++;
    continue;
  }

  // Build profile data from Firestore record
  const profileData = {
    full_name: clean(d.name) ?? clean(d.userName),
    phone: clean(d.phone),
    residence: clean(d.residence),
    workplace: clean(d.workplace),
    focus: clean(d.focus),
    details: clean(d.details),
    legacy_address: clean(d.legacyAddress),
    legacy_business_details: clean(d.legacyBusinessDetails),
    legacy_timestamp: clean(d.legacyTimestamp),
    source: d.source || (d.id.startsWith('legacy_') ? 'csv-import-2022' : 'firestore-migrated'),
  };

  console.log(`\n▶ ${email}`);
  console.log(`  Firestore id: ${d.id}`);
  console.log(`  data: ${JSON.stringify({ name: profileData.full_name, phone: profileData.phone, source: profileData.source })}`);

  if (!COMMIT) {
    console.log(`  [dry-run] would create/update`);
    continue;
  }

  // Create auth user (idempotent: returns existing if email collision)
  let authUserId;
  const { data: createRes, error: createErr } = await supa.auth.admin.createUser({
    email,
    email_confirm: true,  // skip email confirmation
    user_metadata: { full_name: profileData.full_name },
  });
  if (createErr) {
    if (createErr.message?.toLowerCase().includes('already')) {
      // Already exists — look it up
      const { data: usersList } = await supa.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const existing = usersList?.users.find((u) => u.email?.toLowerCase() === email);
      if (!existing) {
        console.log(`  FAIL: createUser said "already exists" but listUsers can't find ${email}`);
        errors++;
        continue;
      }
      authUserId = existing.id;
    } else {
      console.log(`  FAIL createUser: ${createErr.message}`);
      errors++;
      continue;
    }
  } else {
    authUserId = createRes.user.id;
    created++;
  }

  // Fetch existing profile (created by trigger)
  const { data: existing } = await supa
    .from('profiles')
    .select('*')
    .eq('id', authUserId)
    .maybeSingle();

  // Build update — only fill blank fields, never overwrite existing data
  const update = {};
  for (const [k, v] of Object.entries(profileData)) {
    if (!blank(v) && (!existing || blank(existing[k]))) {
      update[k] = v;
    }
  }

  if (Object.keys(update).length > 0) {
    const { error: updErr } = await supa
      .from('profiles')
      .update(update)
      .eq('id', authUserId);
    if (updErr) {
      console.log(`  FAIL update: ${updErr.message}`);
      errors++;
      continue;
    }
    console.log(`  OK ${created ? 'created+' : 'merged '}${Object.keys(update).length} fields`);
    updated++;
  } else {
    console.log(`  OK ${created ? 'created' : 'unchanged'}`);
  }
}

console.log(`\n=== Summary ===`);
console.log(`Read:    ${docs.length} Firestore docs`);
console.log(`Created: ${created} new auth users`);
console.log(`Updated: ${updated} profiles populated`);
console.log(`Skipped: ${skipped}`);
console.log(`Errors:  ${errors}`);
console.log(`Mode:    ${COMMIT ? 'COMMIT' : 'DRY RUN'}`);
