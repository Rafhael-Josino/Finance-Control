import { inject, injectable } from 'tsyringe';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { IAccountRepository } from '../../repositories/IAccountRepository';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import { AppError } from '@shared/errors/AppErrors';
import auth from '@config/auth';
import { IDateProvider } from '@shared/container/providers/dateProvider/IDateProvider';


interface IRequest {
    userName: string;
    password: string;
}

interface IResponse {
    userName: string;
    token: string;
    refresh_token: string;
}

@injectable()
class SessionUseCase {
    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository,
        @inject("UserTokenRepository")
        private userTokenRepository: IUserTokenRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute( { userName, password }: IRequest ): Promise<IResponse> {
        const usersList = await this.accountRepository.listUsers();
        if (!usersList.includes(userName)) {
            console.log("Username or password incorrect")
            throw new AppError("Username or password incorrect", 403);
        }
        
        const user = await this.accountRepository.getUser(userName);
        
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
            console.log("Username or password incorrect")
            throw new AppError("Username or password incorrect", 403);
        }

        const token = sign({}, auth.secret_token, {
            subject: user.id,
            expiresIn: auth.expires_in_token,
        });
        
        const refresh_token = sign({}, auth.secret_refresh_token, {
            subject: user.id,
            expiresIn: auth.expires_in_refresh_token,
        });

        await this.userTokenRepository.createUserToken({
            user_id: user.id,
            refresh_token,
            created_at: this.dateProvider.addDays(0),
            expires_date: this.dateProvider.addDays(auth.expires_in_refresh_token_Days),
        })

        const session = { userName, token, refresh_token };

        return session;
    }
}

export { SessionUseCase };