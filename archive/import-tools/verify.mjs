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

console.log('=== Firestore members collection ===');
console.log(`Total documents: ${docs.length}`);
console.log(`Legacy records (legacy_*): ${legacy.length}`);
console.log(`Real-user records (Google UID): ${real.length}`);
console.log();

if (legacy.length > 0) {
  console.log('=== Sample legacy record ===');
  const s = legacy[0];
  console.log(JSON.stringify(s, null, 2));
  console.log();
}

const fieldsCheck = {
  haveName: legacy.filter((d) => d.name).length,
  haveEmail: legacy.filter((d) => d.email).length,
  havePhone: legacy.filter((d) => d.phone).length,
  haveLegacyAddress: legacy.filter((d) => d.legacyAddress).length,
  haveLegacyBusiness: legacy.filter((d) => d.legacyBusinessDetails).length,
  haveLegacyTimestamp: legacy.filter((d) => d.legacyTimestamp).length,
  haveSourceTag: legacy.filter((d) => d.source === 'csv-import-2022').length,
};
console.log('=== Field population in legacy records (out of', legacy.length, ') ===');
console.log(JSON.stringify(fieldsCheck, null, 2));

console.log('\n=== All legacy emails (alphabetical) ===');
legacy.map((d) => d.email).sort().forEach((e) => console.log(' ', e));
