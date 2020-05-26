import * as admin from 'firebase-admin';
import { FireBoostAuth } from '../../../src/auth';

const serviceAccount = require('../../../internal/service-account.json');

let app: admin.app.App;
let fireBoostAuth: FireBoostAuth;

beforeAll(async () => {
    // Init application
    app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://firestore-utils.firebaseio.com"
    });

    fireBoostAuth = new FireBoostAuth(app)
});

afterAll(async () => {
    await admin.app().delete();
});

test('deleteAllUsers', async () => {
    await fireBoostAuth.deleteAllUsers();
})
