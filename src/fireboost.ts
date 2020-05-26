import { FirestoreAdminUtils } from './firestore';

export class FireBoost {
  firebase() {}

  firestore(): FirestoreAdminUtils {
    return new FirestoreAdminUtils();
  }
}
