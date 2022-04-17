import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import { CryptoUserVerifications } from '../middlewares/CryptoUserVerificationsPG';
//import { CryptoUserVerifications } from '../middlewares/CryptoUserVerifications';


import { parserCryptoController } from '../useCases/parser';
import { listSheetsController } from '../useCases/listSheets';
import { listUsersController } from '../useCases/listUsers';
import { createUserController } from '../useCases/createUser';
import { getUserController } from '../useCases/getUser';
import { getSheetController} from '../useCases/getSheet';

const cryptoRoutes = Router();

// ----------------------- Middlewares -----------------------------------------
// This declarations will be totally substituted by an imported class containing them
// Also, the userName variable will be obtained from the request's header

const cryptoUserVerifications = new CryptoUserVerifications();

function verifyUserExists(req: Request, res: Response, next: any): any {
	const { userName } = req.params;

	fs.readdir(path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos'), (err, files) => {
		if (err) {
			console.log("Server here - unable to read directory:", err);
			res.status(500).json({error: "Server here - unable to read directory: " + err.message});
		}
		else {
			if (files.includes(`${userName}.json`)) {
				return next();
			}
			else {
				console.log(`Server message: ${userName} does not exist`);
				return res.status(404).json({error: "User does not exist"});
			}
		}
	})
}

function verifyXLSXexists(req: Request, res: Response, next: any): any {
	const { userName } = req.params;

	fs.readdir(path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos'), (err, files) => {
		if (err) {
			console.log("Server here - unable to read directory:", err);
			res.status(500).json({error: "Server here - unable to read directory: " + err.message});
		}
		else {
			console.log(files);
			if (files.includes(`${userName}.xlsx`)) {
				return next();
			}
			else {
				console.log(`Server message: ${userName} 's XLSX file does not exist`);
				return res.status(404).json({error: "User's XLSX file does not exist"});
			}
		}
	})	
}

function verifyUserAlreadyExists(req: Request, res: Response, next: any): any {
	const { userName } = req.body;

	fs.readdir(path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos'), (err, files) => {
		if (err) {
			console.log("Server here - unable to read directory:", err);
			res.status(500).json({error: "Server here - unable to read directory: " + err.message});
		}
		else {
			console.log(files);
			if (files.includes(`${userName}.json`)) {
				console.log("Server message: User already exists");
				return res.status(500).json({error: "User already exists"});
			}
			else {
				return next();
			}
		}
	})
}

// ----------------------- Routes -----------------------------------------


cryptoRoutes.get("/cryptos", (req, res) => {
	const namePath = path.join(__dirname, '..', 'pages', 'cryptos.html');
	fs.readFile(namePath, 'utf8', (err, data) => {
		if (err) {
            console.log("Error reading cryptos index:", err);
            res.status(500).json({ error: "Server here - error reading cryptos.html" + err.message });
        }
        else {
			console.log("Sending cryptos.html");
			res.send(data);
		}
	});
});

cryptoRoutes.get('/cryptos.js', (req, res) => {
	const namePath = path.join(__dirname, '..', 'pages', 'cryptos.js');
	fs.readFile(namePath, 'utf8', (err, data) => {
		if (err) {
            console.log("Error reading cryptos.js:", err);
            res.status(500).json({ error: "Server here - error reading cryptos.js " + err.message });
        }
        else {
			console.log("Sending cryptos.js");
			res.send(data);
		}
	});
});

// ---------------------------
// Obs: Typed functions below:
// ---------------------------


// --------------------------- Crypto Sheets ------------------------------

// Retrieves a list of all sheets parsed and stored
cryptoRoutes.get('/sheets', cryptoUserVerifications.verifyUserExists, (req, res) => {
	listSheetsController.handle(req, res);
});

// Retrieves a specified sheet data from a user
cryptoRoutes.get('/sheet/:sheetName', cryptoUserVerifications.verifyUserExists, (req, res) => {
	getSheetController.handle(req, res);
});

// Parse sheets in the xlsx file uploaded and stores the data obtained
cryptoRoutes.post('/saveSheet', cryptoUserVerifications.verifyUserExists, cryptoUserVerifications.verifyXLSXexists, (req, res) => {
	parserCryptoController.handle(req, res);
});


// --------------------------- Crypto Users ------------------------------

// List users
cryptoRoutes.get('/users', (req, res) => {
	listUsersController.handle(req, res);
})

// Create a new crypto user with empty data stored
cryptoRoutes.post('/user', cryptoUserVerifications.verifyUserAlreadyExists, (req, res) => {
	createUserController.handle(req, res);
});

// Retrieves the crypto user data
cryptoRoutes.get('/user/:userName', verifyUserExists, (req, res) => {
	getUserController.handle(req, res);
});

export { cryptoRoutes };