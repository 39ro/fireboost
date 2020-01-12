import * as firebaseTesting from '@firebase/testing';

import {
  CollectionReference,
  DocumentReference,
} from '@google-cloud/firestore';
import {
  CollectionReferenceHelper,
  DocumentReferenceHelper,
  FirestoreAdminUtils,
} from './helpers';

import TestCollectionReference = firebaseTesting.firestore.CollectionReference;
import TestDocumentReference = firebaseTesting.firestore.DocumentReference;

export class TestFirestoreAdminUtils extends FirestoreAdminUtils {
  ref(r: TestDocumentReference): DocumentReferenceHelper;
  ref(r: TestCollectionReference): CollectionReferenceHelper;
  ref(r: DocumentReference): CollectionReferenceHelper;
  ref(r: CollectionReference): DocumentReferenceHelper;
  ref<T extends CollectionReference | DocumentReference>(r: T) {
    if (!r) {
      throw new Error('Reference need to be set');
    }
    if (this.isDocumentReference(r)) {
      return new DocumentReferenceHelper(r as DocumentReference);
    }
    if (this.isCollectionReference(r)) {
      return new CollectionReferenceHelper(r as CollectionReference);
    }
    throw new Error('Something went wrong');
  }

  isDocumentReference<T>(arg: T): boolean {
    return (
      arg instanceof DocumentReference || arg instanceof TestDocumentReference
    );
  }

  isCollectionReference<T>(arg: T): boolean {
    return (
      arg instanceof CollectionReference ||
      arg instanceof TestCollectionReference
    );
  }
}
