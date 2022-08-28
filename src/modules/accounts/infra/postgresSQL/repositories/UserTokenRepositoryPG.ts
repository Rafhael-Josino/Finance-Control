import { PG } from '@shared/infra/postgresSQL';
import { UserToken } from '@modules/accounts/infra/models/UserTokens';
import { IUserTokenRepository, IGetUserTokenDTO , ICreateUserTokenDTO } from '@modules/accounts/repositories/IUserTokenRepository';

class UserTokenRepository implements IUserTokenRepository {
    async getUserToken( { user_id, refresh_token }: IGetUserTokenDTO ): Promise<UserToken> {
        return await PG.query(
            `SELECT * FROM user_tokens WHERE user_id = $1 AND refresh_token = $2`,
            [user_id, refresh_token]
        );
    }

    async createUserToken( { user_id, refresh_token, expires_date }: ICreateUserTokenDTO ): Promise<UserToken> {
        await PG.query(
            'INSERT INTO user_tokens (user_id, refresh_token, expires_date) VALUES ($1, $2)',
            [user_id, refresh_token, String(expires_date)]
        );

        const resPG = await PG.query(
            `SELECT * FROM user_tokens WHERE user_id = $1 AND refresh_token = $2`,
            [user_id, refresh_token]
        );

        const newUserToken = new UserToken();
        Object.assign(newUserToken, {
            id: resPG.rows[0].id,
            user_id: resPG.rows[0].user_id,
            refresh_token: resPG.rows[0].refresh_token,
            created_at: resPG.rows[0].created_at,
            expires_date: resPG.rows[0].expires_date,
        });

        return newUserToken; 
    }

    async deleteUserToken( id: string ): Promise<void> {
        await PG.query('DELETE FROM user_tokens WHERE id = $1', [id]);

    }
}

export { UserTokenRepository }