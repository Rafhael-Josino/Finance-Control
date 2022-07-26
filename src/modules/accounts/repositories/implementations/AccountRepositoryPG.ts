import { PG } from '../../../../database';
import { Account } from '../../models/Account';
import { ICryptoUserRepository } from '../AccountRepository';

class CryptoUserRepositoryPG implements ICryptoUserRepository {

    /** Returns list of users's names */
    async listUsers(): Promise<string[]> {
        const resPG = await PG.query('SELECT user_name FROM users', []);
        const usersList = resPG.rows.map((row) => row.user_name);

        return usersList;
    }

    /** Returns a user's data */
    async getUser( userName: string ): Promise<Account> {
        const resPG = await PG.query('SELECT * FROM users WHERE user_name = $1', [userName]);
        const cryptoUser = new Account();
        Object.assign(cryptoUser, {
            id: resPG.rows[0].user_id,
            name: resPG.rows[0].user_name,
            isAdmin: resPG.rows[0].isadmin,
            created_at: resPG.rows[0].created_on,
        });
        return cryptoUser;
    }

    /** Creates a new user */
    async createUser( userName: string ): Promise<void> {
        await PG.query(
            'INSERT INTO users (user_name) VALUES ($1)',
            [userName]
        );
    }

    /** Deletes a user */
    async deleteUser( userName: string ): Promise<void> {
        await PG.query('DELETE FROM users WHERE user_name = $1', [userName]);
    }
}

export { CryptoUserRepositoryPG }