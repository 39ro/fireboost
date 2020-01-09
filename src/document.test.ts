import * as firebaseTesting from '@firebase/testing';
import { FirestoreAdminUtils } from './helpers';

const adminUtilsFirestore = new FirestoreAdminUtils();

jest.mock('firebase-admin', () => {
  return {
    firestore: {
      FieldValue: firebaseTesting.firestore.FieldValue,
    },
  };
});

const PROJECT_ID = `firestore-utils-project-${new Date().getTime()}`;

let app;
let db: firebaseTesting.firestore.Firestore;

beforeAll(async () => {
  // Init application
  app = firebaseTesting.initializeTestApp({
    projectId: PROJECT_ID,
  });
  db = app.firestore();
});

beforeEach(async () => {
  // Clean Firestore Dataset and applications
  await firebaseTesting.clearFirestoreData({
    projectId: 'firestore-utils-project',
  });
});

afterAll(async () => {
  await firebaseTesting.apps().map(app => app.delete());
});

test('ref.renameField: doc not exist, does nothing', async () => {
  // set document
  const colRef = db.collection('test_users');

  const doc0 = colRef.doc('0');

  const result = await adminUtilsFirestore
    .ref(doc0)
    .renameField({ nme: 'name' });

  expect(result).toBe(null);
});

test('ref.renameField: Both old and new field key NOT exist, does nothing', async () => {
  const USER = { uid: '1' };
  // set document
  const colRef = db.collection('test_users');

  const doc0 = colRef.doc('0');
  await doc0.set(USER);

  const result = await adminUtilsFirestore
    .ref(doc0)
    .renameField({ nme: 'name' });

  const doc0Data = (await doc0.get()).data();

  expect(result).toBe(null);
  expect(JSON.stringify(doc0Data)).toBe(JSON.stringify(USER));
});

test('ref.renameField: New field already exist, old field not exist, does nothing', async () => {
  const USER = { uid: '1', name: 'Giovanni' };
  // set document
  const colRef = db.collection('test_users');

  const doc0 = colRef.doc('0');
  await doc0.set(USER);

  const result = await adminUtilsFirestore
    .ref(doc0)
    .renameField({ nme: 'name' });

  const doc0Data = (await doc0.get()).data();

  expect(result).toBe(null);
  expect(doc0Data).toMatchObject(USER);
});

test('ref.renameField: Both old and new fields key exists, delete old field key', async () => {
  const USER = { uid: '1', nme: 'Giovanni', name: 'Giovanni' };
  const USER_EXPECTED = { uid: '1', name: 'Giovanni' };
  // set document
  const colRef = db.collection('test_users');

  const doc0 = colRef.doc('0');
  await doc0.set(USER);

  await adminUtilsFirestore.ref(doc0).renameField({ nme: 'name' });

  const doc0Data = (await doc0.get()).data();

  if (!doc0Data) {
    throw new Error('Doc data not exist');
  }
  expect(doc0Data.nme).toBe(undefined);
  expect(doc0Data.name).toBe(USER_EXPECTED.name);
  expect(doc0Data.uid).toBe(USER_EXPECTED.uid);
  expect(doc0Data).toMatchObject(USER_EXPECTED);
});

test('ref.renameField: Old key exist and new key NOT exist, update doc with new field key preserving old field value, then delete old field key', async () => {
  const USER = { uid: '1', nme: 'Giovanni' };
  const USER_EXPECTED = { uid: '1', name: 'Giovanni' };
  // set document
  const colRef = db.collection('test_users');

  const doc0 = colRef.doc('0');
  await doc0.set(USER);

  await adminUtilsFirestore.ref(doc0).renameField({ nme: 'name' });

  const doc0Data = (await doc0.get()).data();

  if (!doc0Data) {
    throw new Error('Doc data not exist');
  }
  expect(doc0Data.nme).toBe(undefined);
  expect(doc0Data.name).toBe(USER_EXPECTED.name);
  expect(doc0Data.uid).toBe(USER_EXPECTED.uid);
  expect(doc0Data).toMatchObject(USER_EXPECTED);
});

test('ref.renameField: Able to rename field in a doc inside a subcollection', async () => {
  const USER = { uid: '1', nme: 'Giovanni' };
  const USER_EXPECTED = { uid: '1', name: 'Giovanni' };
  const PET = { nme: 'dog' };
  const PET_EXPECTED = { name: 'dog' };

  const colRef = db.collection('test_users');
  const doc0 = colRef.doc('0');

  // set document
  await doc0.set(USER);

  const subColRef = doc0.collection('pets');
  const subColDoc0 = subColRef.doc('dog');

  // set document to subcollection
  await subColDoc0.set(PET);

  await adminUtilsFirestore.ref(doc0).renameField({ nme: 'name' });

  await adminUtilsFirestore.ref(subColDoc0).renameField({ nme: 'name' });

  const doc0Data = (await doc0.get()).data();
  const subColDoc0Data = (await subColDoc0.get()).data();

  if (!doc0Data || !subColDoc0Data) {
    throw new Error('Doc data not exist');
  }
  expect(doc0Data.nme).toBe(undefined);
  expect(doc0Data.name).toBe(USER_EXPECTED.name);
  expect(doc0Data.uid).toBe(USER_EXPECTED.uid);
  expect(doc0Data).toMatchObject(USER_EXPECTED);

  expect(subColDoc0Data.nme).toBe(undefined);
  expect(subColDoc0Data.name).toBe(PET_EXPECTED.name);
});
