import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'kosa05-repository',
});
const db = admin.firestore();

const snap = await db.collection('members').get();
const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

const legacy = docs.filter((d) => d.id.startsWith('legacy_'));
const real = docs.filter((d) => !d.id.startsWith('legacy_'));

const norm = (e) => (e || '').trim().toLowerCase();
const realByEmail = new Map();
for (const r of real) {
  const e = norm(r.email);
  if (e) realByEmail.set(e, r);
}

console.log(`Legacy records: ${legacy.length}`);
console.log(`Real-user records: ${real.length}`);
console.log();

const overlaps = [];
for (const l of legacy) {
  const e = norm(l.email);
  if (realByEmail.has(e)) {
    overlaps.push({ email: e, legacyId: l.id, realId: realByEmail.get(e).id, realName: realByEmail.get(e).name, legacyName: l.name });
  }
}

console.log(`Email overlaps (same person likely has both a legacy and a real-user record):`);
console.log(`Count: ${overlaps.length}`);
for (const o of overlaps) {
  console.log(`  ${o.email}`);
  console.log(`    real:   id=${o.realId.slice(0, 12)}...  name="${o.realName}"`);
  console.log(`    legacy: id=${o.legacyId}             name="${o.legacyName}"`);
}

console.log();
console.log(`Real-user records with NO legacy match (only signed in, not in CSV):`);
const realOnly = real.filter((r) => !legacy.some((l) => norm(l.email) === norm(r.email)));
console.log(`Count: ${realOnly.length}`);
for (const r of realOnly) {
  console.log(`  ${r.email || '(no email)'}  —  name="${r.name || '(no name)'}"`);
}
