<div align="center">
  <h1>Fireboost</h1>
</div>

![npm](https://img.shields.io/npm/v/admin-utils-firestore.svg)
![Travis](https://img.shields.io/travis/39ro/admin-utils-firestore)
![NPM](https://img.shields.io/npm/l/admin-utils-firestore)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

<hr>

Helpers used for common admin tasks on Firebase (Authentication, Firestore).


### Installation:

- To install fireboost using npm, open a terminal/console window and enter the following command:
```
 npm install --save fireboost
```

- Init fireboost via:
```javascript
import {FireBoost} from 'fireboost';

const fireBoost = new FireBoost();
```

<hr>

### Documentation:

### Authentication
Initializate fireboost with a Firebase App
```javascript
import * as admin from 'firebase-admin';
import {FireBoost} from 'fireboost';

const serviceAccount = require('./service-account.json');

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "__YOUR__DATABASE_URL__"
});

const appAuthRef = new FireBoost().auth(app);
```

###### API

- **deleteAllUsers**<br>
_Delete all userRecors found in your Firebase App_
```javascript
appAuthRef.deleteAllUsers()
    // teardown
    .then(() => app.delete())
    .catch(console.log);
```




### Firestore


##### Collections
Target a firestore collection reference via:
```javascript
const colRef = db.collection('test');
const utilColRef = fireBoost.ref(colRef);
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
const utilDocRef = fireBoost.ref(docRef);
```

###### API

- **renameField**<br>
_For the referenced document performs a update operation of the new field key, and then performs, if it exist, a remove operation of the old field key_
```javascript
utilDocRef.renameField({oldFieldKey: 'newFieldKey'})
```


<br>


### Just a reminder
This in a unofficial library for Firestore (https://firebase.google.com/docs/firestore) we recommend replicating the operation, where it's possible, in a test project to check if the output is what expected before to run any operation in a production environment.
Thanks for using and testing this library!

### Contributing
For bugs and feature requests please [Create an Issue](https://github.com/39ro/fireboost/issues/new).
