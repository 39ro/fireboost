<div align="center">
  <h1>Admin Utils Firestore</h1>
</div>

![npm](https://img.shields.io/npm/v/admin-utils-firestore.svg)
![License](https://img.shields.io/github/license/39ro/admin-utils-firestore)
![Travis](https://img.shields.io/travis/39ro/admin-utils-firestore)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

<hr>


Unofficial library Utils class for Firestore (https://firebase.google.com/docs/firestore)
<br>
We recommend replicating the operation, where it's possible, in a test project to avoid accidental data compromises and check if the output is what expected before to run any operation in a production environment.

##### Installation:
```
$ npm install --save admin-utils-firestore
```

Init admin-utils-firestore via:
```javascript
import {FirestoreAdminUtils} from 'admin-utils-firestore';
const adminUtilsFirestore = new FirestoreAdminUtils();
```


##### Collections
Target a firestore collection reference via:
```javascript
const colRef = db.collection('test');
const utilColRef = adminUtilsFirestore.ref(colRef);
```

###### API

- **deleteFieldDocs**<br>
_For each documents in a referenced collection performs a delete operation of the old field key_
```javascript
utilColRef.deleteFieldDocs('fieldKeyToDelete')
```

- **importDocs**<br>
_Allow to import documents in a collection using a bulk operation_
```javascript
utilColRef.importDocs({uid: '1'}, {uid: '2', name: 'Giovanni'})
```

- **renameFieldDocs**<br>
_For each documents in a referenced collection performs a update operation of the new field key, and then performs, if it exist, a remove operation of the old field key_
```javascript
utilColRef.renameFieldDocs({oldFieldKey: 'newFieldKey'})
```


##### Documents
Target a firestore document reference via:
```javascript
const docRef = db.collection('users').doc('xyz');
const utilDocRef = adminUtilsFirestore.ref(docRef);
```

###### API

- **renameField**<br>
_For the referenced document performs a update operation of the new field key, and then performs, if it exist, a remove operation of the old field key_
```javascript
utilDocRef.renameField({oldFieldKey: 'newFieldKey'})
```

[license-url]: https://github.com/prescottprue/fireadmin/blob/master/LICENSE
