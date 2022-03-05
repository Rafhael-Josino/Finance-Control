import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

class CryptoUserVerifications {
    verifyUserExists(req: Request, res: Response, next: any): any {
        const { username } = req.headers;
        const pathName = path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos');

        try {
            const dirFiles = fs.readdirSync(pathName, 'utf8');

            if (dirFiles.includes(`${username}.json`)) {
                return next();
            }
            else {
                console.log(`Server's middleware here - ${username} does not exist`);
                return res.status(404).json({ error: "User does not exist" });
            }
        } catch (err) {
            console.log("Server here - unable to read directory:", err);
            res.status(500).json({error: "Server's middleware here - unable to read directory: " + err.message});
        }
    }
    
    verifyXLSXexists(req: Request, res: Response, next: any): any {
        const { username } = req.headers;
    
        fs.readdir(path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos'), (err, files) => {
            if (err) {
                console.log("Server here - unable to read directory:", err);
                res.status(500).json({error: "Server here - unable to read directory: " + err.message});
            }
            else {
                console.log(files);
                if (files.includes(`${username}.xlsx`)) {
                    return next();
                }
                else {
                    console.log(`Server message: ${username} 's XLSX file does not exist`);
                    return res.status(404).json({error: "User's XLSX file does not exist"});
                }
            }
        })	
    }
    
    verifyUserAlreadyExists(req: Request, res: Response, next: any): any {
        const { username } = req.headers;
    
        fs.readdir(path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos'), (err, files) => {
            if (err) {
                console.log("Server here - unable to read directory:", err);
                res.status(500).json({error: "Server here - unable to read directory: " + err.message});
            }
            else {
                console.log(files);
                if (files.includes(`${username}.json`)) {
                    console.log("Server message: User already exists");
                    return res.status(500).json({error: "User already exists"});
                }
                else {
                    return next();
                }
            }
        })
    }
}

export { CryptoUserVerifications }