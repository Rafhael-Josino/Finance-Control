import { inject, injectable } from 'tsyringe';
import { sign, verify } from 'jsonwebtoken';

import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import auth from '@config/auth';
import { AppError } from '@shared/errors/AppErrors';
import { IDateProvider } from '@shared/container/providers/dateProvider/IDateProvider';

interface IPayLoad {
    sub: string;
}

interface IRefreshTokenResponse {
    refresh_token: string;
    token: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UserTokenRepository")
        private userTokenRepository: IUserTokenRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute(refresh_token: string): Promise<IRefreshTokenResponse> {
        try {
            const { sub: user_id } = verify(
                refresh_token,
                auth.secret_token
            ) as IPayLoad;

            const userToken = await this.userTokenRepository.getUserToken({
                user_id,
                refresh_token,
            });

            if(!userToken) throw new AppError("Refresh tokan does not exists", 404);

            await this.userTokenRepository.deleteUserToken(userToken.id);

            const new_refresh_token = sign({}, auth.secret_refresh_token, {
                subject: userToken.user_id,
                expiresIn: auth.expires_in_refresh_token,
            });

            const new_token = sign({}, auth.secret_token, {
                subject: userToken.user_id,
                expiresIn: auth.expires_in_token,
            });

            await this.userTokenRepository.createUserToken({
                user_id: userToken.user_id,
                refresh_token: new_refresh_token,
                created_at: this.dateProvider.addDays(0),
                expires_date: this.dateProvider.addDays(auth.expires_in_refresh_token_Days),
            });

            return {
                refresh_token: new_refresh_token,
                token: new_token
            }

        } catch(err) {
            console.log('Invalid token');
            throw new AppError("Invalid token", 403);
        }
    }
}

export { RefreshTokenUseCase };