/**
 * Test that arbitrary migrated alumni can be issued magic links.
 * Uses admin.generateLink — does NOT send email — only proves the auth pipeline is wired.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const ENV_LOCAL = path.join(import.meta.dirname, '../..', '.env.local');
const env = {};
for (const line of readFileSync(ENV_LOCAL, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.+)$/);
  if (m) env[m[1]] = m[2];
}
const supa = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// 5 sample alumni emails from across the migration
const samples = [
  'imbabali@gmail.com',
  'fahmi.kasozi@gmail.com',
  'mugejjeras@gmail.com',
  'edward.odoki@gmail.com',
  'kalsayub@yahoo.com',
];

let ok = 0;
let fail = 0;
for (const email of samples) {
  const { data, error } = await supa.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: 'https://kosa-app.vercel.app/auth/callback?next=/portal' },
  });
  if (error) {
    console.log(`  FAIL  ${email}  →  ${error.message}`);
    fail++;
    continue;
  }
  // The link will redirect through Supabase's verify endpoint and then to our /auth/callback
  const link = data.properties?.action_link || '';
  console.log(`  OK    ${email}`);
  console.log(`        link host: ${new URL(link).host}`);
  ok++;
}
console.log(`\nResult: ${ok}/${samples.length} alumni can be issued magic links via the auth API.`);
console.log(`Errors: ${fail}`);
