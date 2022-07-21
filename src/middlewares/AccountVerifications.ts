import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

class CryptoUserVerifications {
    verifyUserExists(req: Request, res: Response, next: NextFunction): any {
        try {
            const { username } = req.headers;
            const pathName = path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos');    
            const dirFiles = fs.readdirSync(pathName, 'utf8');

            if (dirFiles.includes(`${username}.json`)) {
                return next();
            }
            else {
                console.log(`Server's middleware here - ${username} does not exist`);
                return res.status(404).json({ error: `Server's middleware here - ${username} does not exist` });
            }
        } catch (err) {
            console.log("Server here - unable to read directory:", err);
            res.status(500).json({error: "Server's middleware here - unable to read directory: " + err.message});
        }
    }
    
    verifyXLSXexists(req: Request, res: Response, next: NextFunction): any { 
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
    
    verifyUserAlreadyExists(req: Request, res: Response, next: NextFunction): any {
        try {
            const { username } = req.headers;
            const pathName = path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos');
            const dirFiles = fs.readdirSync(pathName, 'utf8');
            if (dirFiles.includes(`${username}.json`)) {
                return res.status(403).json({ error: `Server's middleware here - ${username} already exists` });
            }
            return next();
        } catch (err) {
            console.log("Server here - unable to read directory:", err);
            res.status(500).json({error: "Server's middleware here - unable to read directory: " + err.message});    
        }
    }
}

export { CryptoUserVerifications }