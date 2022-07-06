import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';


// ###################### Middleware #########################
import { CryptoUserVerifications } from '../middlewares/CryptoUserVerificationsPG';
//import { CryptoUserVerifications } from '../middlewares/CryptoUserVerifications';

const cryptoUserVerifications = new CryptoUserVerifications();


// ###################### Use Cases #########################
import { parserCryptoController } from '../useCases/parser';
import { listSheetsController } from '../useCases/listSheets';
import { listUsersController } from '../useCases/listUsers';
import { createUserController } from '../useCases/createUser';
import { deleteUserController } from '../useCases/deleteUser';
import { getUserController } from '../useCases/getUser';
import { getSheetController} from '../useCases/getSheet';
import { getSheetSummaryController} from '../useCases/getSheetSummary';
import { deleteSheetController } from '../useCases/deleteSheet';


const cryptoRoutes = Router();


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
cryptoRoutes.get('/sheet/:sheetName/:assetName', cryptoUserVerifications.verifyUserExists, (req, res) => {
	getSheetController.handle(req, res);
});

cryptoRoutes.get('/sheetSummary/:sheetName', cryptoUserVerifications.verifyUserExists, (req, res) => {
	getSheetSummaryController.handle(req, res);
});

// Parse sheets in the xlsx file uploaded and stores the data obtained
cryptoRoutes.post('/saveSheet/:overwrite', cryptoUserVerifications.verifyUserExists, cryptoUserVerifications.verifyXLSXexists, (req, res) => {
	parserCryptoController.handle(req, res);
});

// Delete given sheet's information of a user
cryptoRoutes.delete('/deleteSheet/:sheetName', cryptoUserVerifications.verifyUserExists, (req, res) => {
	deleteSheetController.handle(req, res);
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
cryptoRoutes.get('/user', cryptoUserVerifications.verifyUserExists, (req, res) => {
	getUserController.handle(req, res);
});

// Deletes user
cryptoRoutes.delete('/user', cryptoUserVerifications.verifyUserExists, (req, res) => {
	deleteUserController.handle(req, res);
});

export { cryptoRoutes };