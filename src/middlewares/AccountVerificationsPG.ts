import { NextFunction, Request, Response } from 'express';

import { PG } from '../database';
import { AppError } from '../errors/AppErrors';

class AccountVerifications {
    async verifyUserExists(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { username } = req.headers;
        const userName = username as string;
        
        const resPG = await PG.query('SELECT user_name FROM users where user_name = $1', [userName]);

        if (resPG.rows.length) {
            return next();
        }
        else {
            console.log(`Server's middleware here - ${username} does not exist`);
            throw new AppError(`Server's middleware here - ${username} not found`, 404);
        }
    }

    // For now the XLSX file stays in the logs/crypto directory
    // but it will be changed to be imported, parsed, and then deleted
    
    async verifyUserAlreadyExists(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { username } = req.headers;
        const userName = username as string;
        
        const resPG = await PG.query('SELECT user_name FROM users where user_name = $1', [userName]);

        console.log(resPG.rows);

        if (resPG.rows.length) {
            console.log(`Server's middleware here - ${username} already exists`);
            throw new AppError(`Server's middleware here - ${username} already exists`, 403);
        }
    
        return next();
    }
}

export { AccountVerifications }