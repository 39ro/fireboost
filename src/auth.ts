import * as admin from 'firebase-admin';

export class FireBoostAuth {
  auth: admin.auth.Auth;

  constructor(app: admin.app.App) {
    this.auth = app.auth();
  }

  /*
   * Delete all existing users found in initialized Firebase app
   * appAuthRef.deleteAllUsers()
   * // teardown
   * .then(() => app.delete())
   */
  async deleteAllUsers(nextPageToken?: string): Promise<void> {
    const listUsersResult = await this.auth.listUsers(10, nextPageToken);
    const usersID: string[] = listUsersResult.users.map(
      userRecord => userRecord.uid
    );
    const listUsers = { usersID, token: listUsersResult.pageToken };

    console.log('List users length: ', listUsers.usersID.length);

    for (const uid of listUsers.usersID) {
      await this.auth.deleteUser(uid);
      console.log('Deleted user: ', uid);
    }

    if (listUsers.token) {
      console.log('List users: ', listUsers.token);
      await this.deleteAllUsers(listUsers.token);
    }
    return;
  }
}
