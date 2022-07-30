import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { PG } from '../database';
import { AppError } from '../errors/AppErrors';

interface IPayLoad {
    sub: string;
}

class AccountVerifications {
    async verifyUserExists(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { username } = req.headers;
        const userName = username as string;
        
        const resPG = await PG.query('SELECT user_id FROM users where user_name = $1', [userName]);

        if (resPG.rows.length) {
            req.user = { id: resPG.rows[0].user_id };

            return next();
        }
        else {
            throw new AppError(`Server's middleware here - account ${username} not found`, 404);
        }
    }

    // For now the XLSX file stays in the logs/crypto directory
    // but it will be changed to be imported, parsed, and then deleted
    
    async verifyUserAlreadyExists(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { userName } = req.body;
        
        const resPG = await PG.query('SELECT user_name FROM users where user_name = $1', [userName]);

        console.log(resPG.rows);

        if (resPG.rows.length) {
            console.log(`Server's middleware here - ${userName} already exists`);
            throw new AppError(`Server's middleware here - ${userName} already exists`, 403);
        }
    
        return next();
    }

    async verifySession(req: Request, res: Response, next: NextFunction): Promise<any> {
        // Authentication with Bearer Token
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new AppError("Token missing", 404);

        const [, token] = authHeader.split(" ");

        try {
            const { sub: user_id } = verify(
                token,
                "ad9da275a544684b597372149318f020"
            ) as IPayLoad;

            req.user = { id: user_id }

            return next();
        } catch(err) {
            throw new AppError("Invalid token", 403);
        }
    }
}

export { AccountVerifications }