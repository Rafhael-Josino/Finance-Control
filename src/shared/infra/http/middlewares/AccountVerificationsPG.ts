import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { PG } from '../../postgresSQL';
import { AppError } from '@shared/errors/AppErrors';

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

    async verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { id } = req.user;
    
        const resPG = await PG.query(`SELECT isadmin FROM users WHERE user_id = $1`, [id]);
    
        if (!resPG.rows[0].isadmin) throw new AppError('Restric to administrator', 403);
    
        next();
    }
}

export { AccountVerifications }