import { UserToken } from '@modules/accounts/infra/models/UserTokens';;

interface IGetUserTokenDTO {
    user_id: string;
    refresh_token: string;
}

interface ICreateUserTokenDTO {
    user_id: string;
    refresh_token: string;
    expires_date: Date;
}

interface IUserTokenRepository {
    getUserToken( { user_id, refresh_token }: IGetUserTokenDTO ): Promise<UserToken>;
    createUserToken( { user_id, refresh_token, expires_date }: ICreateUserTokenDTO ): Promise<UserToken>;
    deleteUserToken( id: string ): Promise<void>;
}

export { IUserTokenRepository, IGetUserTokenDTO, ICreateUserTokenDTO };