import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import { PG } from '../database';
import { AppError } from '../errors/AppErrors';

class CryptoSheetVerifications {
    async verifySheetExists(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { username } = req.headers;
        const userName = username as string;
        const { sheetName } = req.params;

        const resPG = await PG.query(
            `
            SELECT sheet_name FROM sheets WHERE           
            user_id = (SELECT user_id WHERE user_name = $1)
            `,
            [userName]
        );

        if (resPG.rows.includes(sheetName)) {
            return next();
        }

        throw new AppError(
            `Server's middleware here - ${sheetName} of user ${userName} not found`,
            404
        );
    }

    verifyXLSXexists(req: Request, res: Response, next: NextFunction): any { 
        const { username } = req.headers;
        const pathName = path.join(__dirname, '..', '..', 'logs', 'cryptos');
        const dirFiles = fs.readdirSync(pathName, 'utf8');

        if (dirFiles.includes(`${username}.xlsx`)) {
            return next();
        }
        else {
            console.log(`Server's middleware here - file ${username}.xlsx does not exist`);
            throw new AppError(`Server's middleware here - file ${username}.xlsx not found`, 404);
        }
    }
}

export { CryptoSheetVerifications }