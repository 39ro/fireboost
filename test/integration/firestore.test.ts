import { firestore } from 'firebase-admin';
import { FireBoost } from '../../src/fireboost';

import { CollectionReferenceHelper } from '../../src/firestore';
import * as admin from 'firebase-admin';

let db: firestore.Firestore;

beforeAll(async () => {
    // Init application
    const app = admin.initializeApp()
    db = app.firestore();
});

afterAll(async () => {
    await admin.app().delete();
});

test('FireBoost().firestore().ref() as Collection', () => {
    const colRef = db.collection('test');
    expect(new FireBoost().firestore().ref(colRef)).toBeInstanceOf(CollectionReferenceHelper);
});

test('FireBoost().firestore().ref() as Document', () => {
    const colRef = db.collection('test');
    expect(new FireBoost().firestore().ref(colRef)).toBeInstanceOf(CollectionReferenceHelper);
});
