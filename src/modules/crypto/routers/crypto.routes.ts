import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import { parserCryptoController } from '../useCases/parser';
import {listSheetsController } from '../useCases/listSheets';
import { createUserController } from '../useCases/createUser';
import { getUserController } from '../useCases/getUser';
import { getSheetController} from '../useCases/getSheet';

const cryptoRoutes = Router();

// ----------------------- Middlewares -----------------------------------------

// Transform middleware in a repository function that is just imported and called here
// I do not know if it is the correct practice
// but this way, the verification's responsibility passes to be owned by the repository
function verifyUserExists(req: Request, res: Response, next: any): any {
	const { userName } = req.body;

	fs.readdir(path.join(__dirname, '..', '..', '..', '..', 'logs', 'cryptos'), (err, files) => {
		if (err) {
			console.log("Server here - unable to read directory:", err);
			res.status(500).json({error: "Server here - unable to read directory: " + err.message});
		}
		else {
			console.log(files);
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
	const { userName } = req.body;

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

cryptoRoutes.get('/sheets', verifyUserExists, (req, res) => {
	listSheetsController.handle(req, res);
	
	// Must handle errors
	//res.json({ sheetsNames });
});



// Obs: Typed functions below:

cryptoRoutes.post('/operations', verifyUserExists, verifyXLSXexists, (req, res) => {
	parserCryptoController.handle(req, res);
})

// --------------------------- Crypto Users ------------------------------

cryptoRoutes.post('/user', verifyUserAlreadyExists, (req, res) => {
	createUserController.handle(req, res);
});

cryptoRoutes.get('/user', verifyUserExists, (req, res) => {
	getUserController.handle(req, res);
});

cryptoRoutes.get('/user/:sheetName', verifyUserExists, (req, res) => {
	getSheetController.handle(req, res);	
});

export { cryptoRoutes };