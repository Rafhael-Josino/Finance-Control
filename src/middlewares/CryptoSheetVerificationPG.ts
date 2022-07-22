import { NextFunction, Request, Response } from 'express';

import { PG } from '../database';
import { AppError } from '../errors/AppErrors';

class CryptoVerifications {
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
}

export { CryptoVerifications }