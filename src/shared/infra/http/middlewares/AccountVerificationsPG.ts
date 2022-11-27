import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { PG } from '@shared/infra/postgresSQL';
import { AppError } from '@shared/errors/AppErrors';
import auth from '@config/auth';

interface IPayLoad {
    sub: string;
}

class AccountVerifications {
    async verifySession(req: Request, res: Response, next: NextFunction): Promise<any> {
        // Authentication with Bearer Token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log("token missing");
            throw new AppError("Token missing", 404);
        }

        const [, token] = authHeader.split(" ");

        try {
            const { sub: user_id } = verify(
                token,
                auth.secret_token
            ) as IPayLoad;

            //req.user.id = user_id;
            req.user = { id: user_id }

            return next();
        } catch(err) {
            console.log('Invalid token');
            throw new AppError("Invalid token", 403);
        }
    }

    // For now the XLSX file stays in the logs/crypto directory
    // but it will be changed to be imported, parsed, and then deleted


    async verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { id } = req.user;
    
        const resPG = await PG.query(`SELECT isadmin FROM users WHERE user_id = $1`, [id]);
    
        if (!resPG.rows[0].isadmin) throw new AppError('Restric to administrator', 403);
    
        next();
    }
    
    async verifyAdminOrOwner(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { id } = req.user;
        const { username } = req.headers;

        const resPG = await PG.query(`SELECT user_name, isadmin FROM users WHERE user_id = $1`, [id]);
    
        console.log("user:", resPG.rows[0].user_name);
        console.log('username requester:', username);

        if (!resPG.rows[0].isadmin && resPG.rows[0].user_name !== username) {
            throw new AppError('Restric to administrator', 403);
        }
    
        next();    
    }
}

export { AccountVerifications }