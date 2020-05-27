import * as admin from 'firebase-admin';
import { FireBoost } from '../../src/fireboost';

import { CollectionReferenceHelper, DocumentReferenceHelper, FireBoostFirestore } from '../../src/firestore';
import { FireBoostAuth } from '../../src/auth';

let db: admin.firestore.Firestore;
let app: admin.app.App;

beforeAll(async () => {
    // Init application
    app = admin.initializeApp();
    db = app.firestore();
});

afterAll(async () => {
    await admin.app().delete();
});

test('FireBoost().firestore()', () => {
    expect(new FireBoost().firestore()).toBeInstanceOf(FireBoostFirestore);
});

test('FireBoost().auth()', () => {
    expect(new FireBoost().auth(app)).toBeInstanceOf(FireBoostAuth);
});

test('FireBoost().firestore().ref() as Collection', () => {
    const colRef = db.collection('test');
    expect(new FireBoost().firestore().ref(colRef)).toBeInstanceOf(CollectionReferenceHelper);
});

test('FireBoost().firestore().ref() as Document', () => {
    const docRef = db.collection('test').doc('123');
    expect(new FireBoost().firestore().ref(docRef)).toBeInstanceOf(DocumentReferenceHelper);
});
