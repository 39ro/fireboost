import { FireBoost } from '../../src/fireboost';
import { FirestoreAdminUtils } from '../../src/firestore';

test('FireBoost().firestore()', () => {
    expect(new FireBoost().firestore()).toBeInstanceOf(FirestoreAdminUtils);
});
