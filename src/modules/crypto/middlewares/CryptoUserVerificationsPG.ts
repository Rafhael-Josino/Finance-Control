import { PG } from '../../../database';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

class CryptoUserVerifications {
    //async verifyUserExists(req: Request, res: Response, next: any): Promise<any> {
    async verifyUserExists(req: Request, res: Response, next: any): Promise<any> {
        try {
            const { username } = req.headers;
            const userName = username as string;
            
            const resPG = await PG.query('SELECT username FROM users where username = $1', [userName]);

            //console.log(resPG.rows);

            if (resPG.rows.length) {
                return next();
            }
            else {
                console.log(`Server's middleware here - ${username} does not exist`);
                return res.status(404).json({ error: `Server's middleware here - ${username} does not exist` });
            }

        } catch (err) {
            console.log("Server's middleware (verifyUserExists) here:", err);
            // change error message
            res.status(500).json({error: "Server's middleware here - unable to read directory: " + err.message});
        }
    }

    // For now the XLSX file stays in the logs/crypto directory
    // but it will be changed to be imported, parsed, and then deleted
    verifyXLSXexists(req: Request, res: Response, next: any): any { 
        try {
            const { username } = req.headers;
            const pathName = path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos');
            const dirFiles = fs.readdirSync(pathName, 'utf8');

            if (dirFiles.includes(`${username}.xlsx`)) {
                return next();
            }
            else {
                console.log(`Server's middleware here - file ${username}.xlsx does not exist`);
                return res.status(404).json({ error: `Server's middleware here - file ${username}.xlsx does not exist` });
            }
        } catch (err) {
            console.log("Server here - unable to read directory:", err);
            res.status(500).json({error: "Server's middleware here - unable to read directory: " + err.message});
        }        
    }
    
    async verifyUserAlreadyExists(req: Request, res: Response, next: any): Promise<any> {
        try {
            const { username } = req.headers;
            const userName = username as string;
            
            const resPG = await PG.query('SELECT username FROM users where username = $1', [userName]);

            console.log(resPG.rows);

            if (resPG.rows.length) {
                console.log(`Server's middleware here - ${username} already exists`);
                return res.status(403).json({ error: `Server's middleware here - ${username} already exists` });
            }
            else {
                return next();
            }

/*
            const pathName = path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos');
            const dirFiles = fs.readdirSync(pathName, 'utf8');
            if (dirFiles.includes(`${username}.json`)) {
                return res.status(403).json({ error: `Server's middleware here - ${username} already exists` });
            }
            return next();
*/

        } catch (err) {
            console.log("Server's middleware here - unable to read directory:", err);
            res.status(500).json({error: "Server's middleware here - unable to read directory: " + err.message});    
        }
    }

}

export { CryptoUserVerifications }