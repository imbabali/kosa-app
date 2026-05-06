import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'csv-parse/sync';
import admin from 'firebase-admin';

const CSV_PATH = '/Users/Ismail/Downloads/mbabas-projects/kosa-app/Contact Information.csv';
const PROJECT_ID = 'kosa05-repository';
const COLLECTION = 'members';
const COMMIT = process.argv.includes('--commit');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: PROJECT_ID,
});
const db = admin.firestore();

function parseCsvTimestamp(s) {
  if (!s) return null;
  const m = s.trim().match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{2}):(\d{2}) (am|pm) GMT([+-]\d+)$/i,
  );
  if (!m) return null;
  let [, y, mo, d, h, mi, se, ampm, off] = m;
  h = parseInt(h, 10);
  if (ampm.toLowerCase() === 'pm' && h !== 12) h += 12;
  if (ampm.toLowerCase() === 'am' && h === 12) h = 0;
  const offHours = parseInt(off, 10);
  const sign = offHours >= 0 ? '+' : '-';
  const offStr = `${sign}${String(Math.abs(offHours)).padStart(2, '0')}:00`;
  const iso = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${mi}:${se}${offStr}`;
  const dt = new Date(iso);
  return isNaN(dt.getTime()) ? null : dt;
}

function legacyDocId(email) {
  const norm = email.trim().toLowerCase();
  return 'legacy_' + createHash('sha1').update(norm).digest('hex').slice(0, 12);
}

function clean(v) {
  if (v == null) return '';
  return String(v).trim();
}

function isBlank(v) {
  return v == null || String(v).trim() === '';
}

const raw = readFileSync(CSV_PATH, 'utf8');
const rows = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  trim: true,
});

console.log(`\n=== Read ${rows.length} rows from CSV ===\n`);

const byEmail = new Map();
let droppedNoEmail = 0;
for (const r of rows) {
  const email = clean(r['Email']).toLowerCase();
  if (!email) {
    droppedNoEmail++;
    continue;
  }
  const ts = parseCsvTimestamp(r['Timestamp']);
  const existing = byEmail.get(email);
  if (!existing || (ts && existing._ts && ts > existing._ts) || (ts && !existing._ts)) {
    byEmail.set(email, { ...r, _ts: ts });
  }
}

const deduped = [...byEmail.values()];
console.log(`Deduped to ${deduped.length} unique emails.`);
if (droppedNoEmail) console.log(`Dropped ${droppedNoEmail} rows with no email.`);
console.log(`Duplicates collapsed: ${rows.length - deduped.length - droppedNoEmail}\n`);

let creates = 0;
let merges = 0;
let mergeFieldFills = 0;
let untouched = 0;
const writes = [];

for (const r of deduped) {
  const name = clean(r['Name']);
  const email = clean(r['Email']);
  const phone = clean(r['Phone number']);
  const address = clean(r['Address']);
  const business = clean(r['Business/Employment Details']);
  const timestamp = clean(r['Timestamp']);

  const docId = legacyDocId(email);
  const ref = db.collection(COLLECTION).doc(docId);
  const snap = await ref.get();

  if (!snap.exists) {
    const data = {
      userId: docId,
      userName: name,
      userEmail: email,
      name,
      email,
      phone,
      residence: '',
      workplace: '',
      focus: '',
      details: '',
      legacyAddress: address,
      legacyBusinessDetails: business,
      legacyTimestamp: timestamp,
      source: 'csv-import-2022',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    creates++;
    writes.push({ kind: 'CREATE', docId, ref, data, preview: { name, email, phone, address, business } });
  } else {
    const cur = snap.data() || {};
    const fill = {};
    const candidate = {
      name,
      email,
      phone,
      legacyAddress: address,
      legacyBusinessDetails: business,
      legacyTimestamp: timestamp,
    };
    for (const [k, v] of Object.entries(candidate)) {
      if (!isBlank(v) && isBlank(cur[k])) fill[k] = v;
    }
    if (!cur.source) fill.source = 'csv-import-2022';
    if (Object.keys(fill).length === 0) {
      untouched++;
      continue;
    }
    fill.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    merges++;
    mergeFieldFills += Object.keys(fill).filter((k) => k !== 'updatedAt').length;
    writes.push({ kind: 'MERGE', docId, ref, data: fill, preview: fill });
  }
}

console.log(`=== Plan ===`);
console.log(`CREATE new legacy records:  ${creates}`);
console.log(`MERGE into existing records: ${merges} (filling ${mergeFieldFills} blank fields total)`);
console.log(`UNTOUCHED (already complete): ${untouched}`);
console.log(`Mode: ${COMMIT ? '*** COMMIT *** (will write)' : 'DRY RUN (no writes)'}`);
console.log();

console.log('=== Per-record preview ===');
for (const w of writes) {
  console.log(`[${w.kind}] ${w.docId}`);
  console.log(JSON.stringify(w.preview, null, 2));
  console.log();
}

if (!COMMIT) {
  console.log('Dry run only. Re-run with --commit to write.');
  process.exit(0);
}

console.log('=== Committing... ===');
let okCreate = 0;
let okMerge = 0;
let errors = 0;
for (const w of writes) {
  try {
    if (w.kind === 'CREATE') {
      await w.ref.set(w.data);
      okCreate++;
    } else {
      await w.ref.set(w.data, { merge: true });
      okMerge++;
    }
  } catch (e) {
    errors++;
    console.error(`FAIL ${w.kind} ${w.docId}: ${e.message}`);
  }
}
console.log(`Done. CREATEs: ${okCreate}, MERGEs: ${okMerge}, errors: ${errors}`);
