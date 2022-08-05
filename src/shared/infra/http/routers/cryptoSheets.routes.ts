import { Router } from 'express';
import path from 'path';
import fs from 'fs';

// ###################### Middleware #########################
import { AccountVerifications } from '../middlewares/AccountVerificationsPG';
import { CryptoSheetVerifications } from '../middlewares/CryptoSheetVerificationsPG';

const accountVerifications = new AccountVerifications();
const cryptoSheetVerifications = new CryptoSheetVerifications();


import { ParserCryptoController } from '@modules/crypto/useCases/parser/parserController';
import { ListSheetsController } from '@modules/crypto/useCases/listSheets/listSheetsController';
import { GetSheetController} from '@modules/crypto/useCases/getSheet/getSheetController';
import { GetSheetSummaryController} from '@modules/crypto/useCases/getSheetSummary/getSheetSummaryController';
import { DeleteSheetController } from '@modules/crypto/useCases/deleteSheet/deleteSheetController';

const getSheetController = new GetSheetController();
const listSheetsController = new ListSheetsController();
const getSheetSummaryController = new GetSheetSummaryController();
const parserSheetController = new ParserCryptoController();
const deleteSheetController = new DeleteSheetController();


// Instance for Router();
const cryptoSheetsRouter = Router();


// ----------------------- Routes -----------------------------------------

cryptoSheetsRouter.get("/cryptos", (req, res) => {
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

cryptoSheetsRouter.get('/cryptos.js', (req, res) => {
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
cryptoSheetsRouter.get(
	'/sheets',
	accountVerifications.verifySession,
	listSheetsController.handle
);

// Retrieves a specified sheet data from a user
cryptoSheetsRouter.get(
	'/sheet/:sheetName/:assetName',
	accountVerifications.verifySession,
	getSheetController.handle
);

cryptoSheetsRouter.get(
	'/sheetSummary/:sheetName',
	accountVerifications.verifySession,
	getSheetSummaryController.handle
);

// Parse sheets in the xlsx file uploaded and stores the data obtained
cryptoSheetsRouter.post(
	'/saveSheet/:overwrite',
	accountVerifications.verifySession,
	cryptoSheetVerifications.verifyXLSXexists,
	parserSheetController.handle
);

// Delete given sheet's information of a user
cryptoSheetsRouter.delete(
	'/deleteSheet/:sheetName',
	accountVerifications.verifySession,
	deleteSheetController.handle
);

// --------------------------- Crypto Users ------------------------------



export { cryptoSheetsRouter };