import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';


// ###################### Middleware #########################
import { CryptoUserVerifications } from '../middlewares/CryptoUserVerificationsPG';
//import { CryptoUserVerifications } from '../middlewares/CryptoUserVerifications';

const cryptoUserVerifications = new CryptoUserVerifications();


// ###################### Use Cases #########################

// Users

//import { createUserController } from '../useCases/createUser';
import { CreateUserController } from '../useCases/createUser/createUserController';
import { DeleteUserController } from '../useCases/deleteUser/deleteUserController';
import { GetUserController } from '../useCases/getUser/getUserController';
import { ListUsersController } from '../useCases/listUsers/ListUsersController';

const getUserController = new GetUserController();
const listUsersController = new ListUsersController();
const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();

// Sheets

import { ParserCryptoController } from '../useCases/parser/parserController';
import { ListSheetsController } from '../useCases/listSheets/listSheetsController';
import { GetSheetController} from '../useCases/getSheet/getSheetController';
import { GetSheetSummaryController} from '../useCases/getSheetSummary/getSheetSummaryController';
import { DeleteSheetController } from '../useCases/deleteSheet/deleteSheetController';

const getSheetController = new GetSheetController();
const listSheetsController = new ListSheetsController();
const getSheetSummaryController = new GetSheetSummaryController();
const parserSheetController = new ParserCryptoController();
const deleteSheetController = new DeleteSheetController();


// Instance for Router();
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
cryptoRoutes.get(
	'/sheets',
	cryptoUserVerifications.verifyUserExists,
	listSheetsController.handle
);

// Retrieves a specified sheet data from a user
cryptoRoutes.get(
	'/sheet/:sheetName/:assetName',
	cryptoUserVerifications.verifyUserExists,
	getSheetController.handle
);

cryptoRoutes.get(
	'/sheetSummary/:sheetName',
	cryptoUserVerifications.verifyUserExists,
	getSheetSummaryController.handle
);

// Parse sheets in the xlsx file uploaded and stores the data obtained
cryptoRoutes.post(
	'/saveSheet/:overwrite',
	cryptoUserVerifications.verifyUserExists,
	cryptoUserVerifications.verifyXLSXexists,
	parserSheetController.handle
);

// Delete given sheet's information of a user
cryptoRoutes.delete(
	'/deleteSheet/:sheetName',
	cryptoUserVerifications.verifyUserExists,
	deleteSheetController.handle
);

// --------------------------- Crypto Users ------------------------------

// List users
cryptoRoutes.get(
	'/users',
	listUsersController.handle
);

cryptoRoutes.post(
	'/user',
	cryptoUserVerifications.verifyUserAlreadyExists,
	createUserController.handle
);

// Retrieves the crypto user data
cryptoRoutes.get(
	'/user',
	cryptoUserVerifications.verifyUserExists,
	getUserController.handle	
);

// Deletes user
cryptoRoutes.delete(
	'/user',
	cryptoUserVerifications.verifyUserExists,
	deleteUserController.handle
);

export { cryptoRoutes };