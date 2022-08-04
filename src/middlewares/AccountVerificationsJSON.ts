import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { AppError } from '@errors/AppErrors';

class CryptoUserVerifications {
    verifyUserExists(req: Request, res: Response, next: NextFunction): any {
        const { username } = req.headers;
        const pathName = path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos');    
        const dirFiles = fs.readdirSync(pathName, 'utf8');

        if (dirFiles.includes(`${username}.json`)) {
            return next();
        }
        else {
            console.log(`Server's middleware here - ${username} does not exist`);
            throw new AppError(`Server's middleware here - ${username} does not exist`, 404);
        }
    }
    
    verifyXLSXexists(req: Request, res: Response, next: NextFunction): any { 
        const { username } = req.headers;
        const pathName = path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos');
        const dirFiles = fs.readdirSync(pathName, 'utf8');

        if (dirFiles.includes(`${username}.xlsx`)) {
            return next();
        }
        else {
            console.log(`Server's middleware here - file ${username}.xlsx does not exist`);
            throw new AppError(`Server's middleware here - file ${username}.xlsx does not exist`, 404);
        }
    }
    
    verifyUserAlreadyExists(req: Request, res: Response, next: NextFunction): any {
        const { username } = req.headers;
        const pathName = path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos');
        const dirFiles = fs.readdirSync(pathName, 'utf8');
        if (dirFiles.includes(`${username}.json`)) {
            throw new AppError(`Server's middleware here - ${username} already exists`, 403);
        }
        return next();
    }
}

export { CryptoUserVerifications }