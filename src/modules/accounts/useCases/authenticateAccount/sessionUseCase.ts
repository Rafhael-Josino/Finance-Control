import { ICryptoUserRepository } from '../../repositories/AccountRepository';
import { inject, injectable } from 'tsyringe';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { AppError } from '../../../../errors/AppErrors';

interface IRequest {
    userName: string;
    password: string;
}

interface IResponse {
    userName: string;
    token: string;
}

@injectable()
class SessionUseCase {
    constructor(
        @inject("CryptoUserRepository")
        private cryptoUserRepository: ICryptoUserRepository
    ) {}

    async execute( { userName, password }: IRequest ): Promise<IResponse> {
        const usersList = await this.cryptoUserRepository.listUsers();
        if (!usersList.includes(userName)) 
            throw new AppError("Username or password incorrect", 403);
        
        const user = await this.cryptoUserRepository.getUser(userName);
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) 
            throw new AppError("Username or password incorrect", 403);

        // MD5 phrase
        const token = sign({}, "ad9da275a544684b597372149318f020", {
            subject: user.id,
            expiresIn: "1d"
        });

        const session = { userName, token };

        const tokenJsonFile = path.join(
            __dirname, '..', '..', '..', '..', 'utils', 'tokens', `${userName}.json`);
        fs.writeFileSync(tokenJsonFile, JSON.stringify(session));        

        return session;
    }
}

export { SessionUseCase };