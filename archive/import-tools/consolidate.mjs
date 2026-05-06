import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'kosa05-repository',
});
const db = admin.firestore();

const COMMIT = process.argv.includes('--commit');
const norm = (e) => (e || '').trim().toLowerCase();
const blank = (v) => v == null || String(v).trim() === '';

const snap = await db.collection('members').get();
const docs = snap.docs.map((d) => ({ id: d.id, _ref: d.ref, ...d.data() }));
const legacy = docs.filter((d) => d.id.startsWith('legacy_'));
const real = docs.filter((d) => !d.id.startsWith('legacy_'));

const realByEmail = new Map();
for (const r of real) {
  const e = norm(r.email);
  if (e) realByEmail.set(e, r);
}

const ARCHIVE_FIELDS = ['legacyAddress', 'legacyBusinessDetails', 'legacyTimestamp', 'source'];
const FILL_IF_BLANK_FIELDS = ['name', 'email', 'phone'];

const ops = [];
for (const l of legacy) {
  const e = norm(l.email);
  const r = realByEmail.get(e);
  if (!r) continue;

  const update = {};
  for (const f of ARCHIVE_FIELDS) {
    if (blank(r[f]) && !blank(l[f])) update[f] = l[f];
  }
  for (const f of FILL_IF_BLANK_FIELDS) {
    if (blank(r[f]) && !blank(l[f])) update[f] = l[f];
  }

  ops.push({
    email: e,
    realId: r.id,
    legacyId: l.id,
    realRef: r._ref,
    legacyRef: l._ref,
    update,
    realName: r.name,
    legacyName: l.name,
  });
}

console.log(`=== Consolidation plan (${ops.length} overlaps) ===\n`);
for (const o of ops) {
  console.log(`▶ ${o.email}`);
  console.log(`  real:   ${o.realId}`);
  console.log(`  legacy: ${o.legacyId}  (will be DELETED)`);
  if (Object.keys(o.update).length === 0) {
    console.log(`  no fields to fill — real record already has all archive data`);
  } else {
    console.log(`  fields to add to real record:`);
    for (const [k, v] of Object.entries(o.update)) {
      const display = String(v).length > 80 ? String(v).slice(0, 77) + '...' : v;
      console.log(`    ${k}: ${JSON.stringify(display)}`);
    }
  }
  console.log();
}

console.log(`Mode: ${COMMIT ? '*** COMMIT *** (will write + delete)' : 'DRY RUN'}\n`);

if (!COMMIT) {
  console.log('Re-run with --commit to apply.');
  process.exit(0);
}

let merges = 0;
let deletes = 0;
let errors = 0;
for (const o of ops) {
  try {
    if (Object.keys(o.update).length > 0) {
      o.update.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      await o.realRef.set(o.update, { merge: true });
      merges++;
    }
    await o.legacyRef.delete();
    deletes++;
  } catch (err) {
    errors++;
    console.error(`FAIL ${o.email}: ${err.message}`);
  }
}
console.log(`Done. Merges: ${merges}, Deletes: ${deletes}, Errors: ${errors}`);
