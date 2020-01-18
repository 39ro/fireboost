import { firestore } from 'firebase-admin';

import {
  Firestore,
  DocumentReference,
  DocumentSnapshot,
  CollectionReference,
  WriteResult,
} from '@google-cloud/firestore';

// Get the `FieldValue` object
import FieldValue = firestore.FieldValue;

class ReferenceHelper<T extends CollectionReference | DocumentReference> {
  readonly reference: T;

  readonly db: Firestore;

  constructor(ref: T) {
    this.reference = ref;
    this.db = this.reference.firestore;
  }
}

export class DocumentReferenceHelper extends ReferenceHelper<
  DocumentReference
> {
  /*
   * For the referenced document performs a update operation of the new field key, and then performs, if it exist, a remove operation of the old field key
   *
   * Rename does nothing if:
   * - old field key doesn't exist and new field not exist
   * - new field key already exist and old field not exist
   *
   * .ref(colRef)
   * .renameField({oldFieldKey: 'newFieldKey'})
   */
  async renameField(arg: {
    [key: string]: string;
  }): Promise<WriteResult | WriteResult[] | null> {
    if (Object.entries(arg).length <= 0) {
      throw new Error('Rename need arguments');
    }

    const entries = Object.entries(arg);
    const oldNameField = entries[0][0];
    const newNameField = entries[0][1];

    const docGet = await this.reference.get();

    // doc not exist
    if (!docGet.exists) {
      return null;
    }
    const docData = docGet.data();

    if (docData) {
      // New field already exist, old field not exist
      if (docData[newNameField] && !docData[oldNameField]) {
        return null;
      }

      // old field key not exist and new field key not exist
      if (!docData[newNameField] && !docData[oldNameField]) {
        return null;
      }

      // Both old and new fields key exists, delete old field key
      if (docData[oldNameField] && docData[newNameField]) {
        return this.reference.update({ [oldNameField]: FieldValue.delete() });
      }

      // old key exist and new key not exist, update doc with new field key preserving old field value, then delete old field key
      if (docData[oldNameField] && !docData[newNameField]) {
        return Promise.all([
          this.reference.update({ [newNameField]: docData[oldNameField] }),
          this.reference.update({ [oldNameField]: FieldValue.delete() }),
        ]);
      }
    }

    return null;
  }
}

export class CollectionReferenceHelper extends ReferenceHelper<
  CollectionReference
> {
  /*
   * For each documents in a referenced collection performs a update operation of the new field key, and then performs, if it exist, a remove operation of the old field key
   * If the old field key doesn't exist "rename" does nothing.
   *
   * Check DocumentReferenceHelper.renameField for more info
   *
   * .ref(colRef)
   * .renameFieldDocs({oldFieldKey: 'newFieldKey'})
   */
  async renameFieldDocs(arg: {
    [key: string]: string;
  }): Promise<Array<WriteResult | WriteResult[] | null>> {
    const snapshot = await this.db.collection(this.reference.id).get();
    const arr = snapshot.docs.map((doc: DocumentSnapshot) =>
      new DocumentReferenceHelper(doc.ref).renameField(arg)
    );
    return Promise.all(arr);
  }

  /*
   * For each documents in a referenced collection performs a delete operation of the old field key
   *
   * .ref(colRef)
   * .deleteFieldDocs('fieldKeyToDelete')
   */
  async deleteFieldDocs(fieldKey: string): Promise<WriteResult[]> {
    const snapshot = await this.db.collection(this.reference.id).get();
    const arr = snapshot.docs.map((doc: DocumentSnapshot) =>
      doc.ref.update({ [fieldKey]: FieldValue.delete() })
    );
    return Promise.all(arr);
  }

  /*
   * Allow to import documents in a collection using a bulk operation
   *
   * .ref(colRef)
   * .importDocs({uid: '1'}, {uid: '2', name: 'Giovanni'})
   */
  importDocs<T extends { id?: string }>(...args: T[]): Promise<WriteResult[]> {
    const arr = args.map(docData => {
      const docId = docData.id ? docData.id : this.reference.doc().id;
      return this.db
        .collection(this.reference.id)
        .doc(docId)
        .set({ id: docId, ...docData });
    });
    return Promise.all(arr);
  }
}

export class FirestoreAdminUtils {
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
    return arg instanceof DocumentReference;
  }

  isCollectionReference<T>(arg: T): boolean {
    return arg instanceof CollectionReference;
  }
}
