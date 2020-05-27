import * as firebaseTesting from '@firebase/testing';

import {
    CollectionReference,
    DocumentReference,
} from '@google-cloud/firestore';


import TestCollectionReference = firebaseTesting.firestore.CollectionReference;
import TestDocumentReference = firebaseTesting.firestore.DocumentReference;
import { CollectionReferenceHelper, DocumentReferenceHelper, FireBoostFirestore } from '../../src/firestore';

export class TestFireBoostFirestore implements FireBoostFirestore {
    ref(r: TestDocumentReference): DocumentReferenceHelper;
    ref(r: TestCollectionReference): CollectionReferenceHelper;
    ref(r: DocumentReference): DocumentReferenceHelper;
    ref(r: CollectionReference): CollectionReferenceHelper;
    ref<T extends CollectionReference | DocumentReference | TestDocumentReference | TestCollectionReference>(r: T) {
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
