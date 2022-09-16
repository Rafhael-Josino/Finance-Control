import { UserToken } from '@modules/accounts/infra/models/UserTokens';;

interface IGetUserTokenDTO {
    user_id: string;
    refresh_token: string;
}

interface ICreateUserTokenDTO {
    user_id: string;
    refresh_token: string;
    created_at: string;
    expires_date: string;
}

interface IUserTokenRepository {
    getUserToken( { user_id, refresh_token }: IGetUserTokenDTO ): Promise<UserToken>;
    createUserToken( { user_id, refresh_token, created_at, expires_date }: ICreateUserTokenDTO ): Promise<UserToken>;
    deleteUserToken( id: string ): Promise<void>;
    deleteUserTokenByUserId( user_id: string ): Promise<void>;
}

export { IUserTokenRepository, IGetUserTokenDTO, ICreateUserTokenDTO };