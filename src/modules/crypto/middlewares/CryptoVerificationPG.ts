import { PG } from '../../../database';
import { Request, Response } from 'express';

class CryptoVerifications {
    async verifySheetExists(req: Request, res: Response, next: any): Promise<any> {
        try {
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

            if (resPG.rows.includes(sheetName)) return next();
            return res.status(404).json({ error: `Server's middleware here - ${sheetName} of user ${userName} not found`});

        } catch (err) {
            console.log("Problem in middleware Verifiy if Sheet Exists");
            return res.status(500).json({ error: "Verify_Sheet_Exists middleware error: " + err.message });
        }
    }
}

export { CryptoVerifications }