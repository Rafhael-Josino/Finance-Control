import fs from 'fs';
import path from 'path';
import { Response } from 'express';
import { ICryptoUserRepository, ICryptoUserRepositoryDTO, ICryptoUserGetSheetDTO } from '../ICryptoUserRepository';
import { CryptoUser } from '../../models/CryptoUser';


class CryptoUserRepositoryJSON implements ICryptoUserRepository {
    listUsers(res: Response): void {
        const pathName = path.join(__dirname, '..', '..', 'logs', 'cryptos');

        fs.readdir(pathName, (err, files) => {
            if (err) {
                console.log("Server here - unable to read directory:", err);
                res.status(500).json({error: "Server here - unable to read directory: " + err.message});
            }
            else {
                const jsonFile = new RegExp('\\w+.json');

                files.filter(file => file.match(jsonFile));
                console.log(files);
                
                const dataFiles = JSON.stringify(files);
                res.send(dataFiles);
            }
        })

    }

    getUser({ userName, res }: ICryptoUserRepositoryDTO): void {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        fs.readFile(pathName, 'utf8', (err, data) => {
            if (err) {
                console.log("Server here - unable to read file:", `${userName}.json` , err);
                res.status(500).json({error: "Server here - unable to read file: " + `${userName}.json ` + err.message});
            }
            else {
                console.log(`Sending ${userName}.json`);
                res.send(data);
            }
        });
    }

    createUser({ userName, res}: ICryptoUserRepositoryDTO): void {
        const newCryptoUServer = new CryptoUser();
        Object.assign(newCryptoUServer, {
            name: userName,
            created_at: new Date(),
        });

        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);
        
        fs.writeFile(pathName, JSON.stringify(newCryptoUServer), err => {
            if (err) {
                console.log(`Server here - Error writting ${userName}.json file:`, err);
                res.status(500).json({error: err.message}); // BAD
            }
            else {
                console.log(`${userName}.json written successfully`);
                res.status(201).send(); // BAD
            }
        });
    }

    listSheets({ userName, res}: ICryptoUserRepositoryDTO): void {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        fs.readFile(pathName, 'utf8', (err, data) => {
            if (err) {
                console.log("Server here - unable to read file:", `${userName}.json` , err);
                res.status(500).json({error: "Server here - unable to read file: " + `${userName}.json ` + err.message});
            }
            else {
                const userData = JSON.parse(data);
                const sheetNames = userData.sheets.map((sheet: any) => sheet.sheetName);

                console.log(`Server here - Sending ${userName}.json's sheet names`);
                res.send(JSON.stringify(sheetNames));
            }
        });
    }

    getSheet({ userName, sheetName, res}: ICryptoUserGetSheetDTO): void {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        fs.readFile(pathName, 'utf8', (err, data) => {
            if (err) {
                console.log("Server here - unable to read file:", `${userName}.json` , err);
                res.status(500).json({error: "Server here - unable to read file: " + `${userName}.json ` + err.message});
            }
            else {
                const userData = JSON.parse(data);
                const sheet = userData.sheets.find((sheet: any) => sheet.sheetName === sheetName);

                if(!sheet) {
                    console.log(`Server here - ${sheetName} not found in ${userName}.json`);
                    res.status(404).send();
                }
                else {
                    console.log(`Sending sheet ${sheet.sheetName} from ${userName}.json's`);
                    res.send(JSON.stringify(sheet));
                }
            }
        });
    }
}

export { CryptoUserRepositoryJSON }