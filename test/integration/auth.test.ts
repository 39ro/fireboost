import * as admin from 'firebase-admin';
import { FireBoost } from '../../src/fireboost';
import { FireBoostAuth } from '../../src/auth';


test('FireBoost().firestore()', () => {
    const app = admin.initializeApp()
    expect(new FireBoost().auth(app)).toBeInstanceOf(FireBoostAuth);
    app.delete();
});
