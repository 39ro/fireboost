import { FireBoostFirestore } from './firestore';
import { FireBoostAuth } from './auth';
import * as admin from 'firebase-admin';

export class FireBoost {
  auth(app: admin.app.App): FireBoostAuth {
    return new FireBoostAuth(app);
  }

  firestore(): FireBoostFirestore {
    return new FireBoostFirestore();
  }
}
