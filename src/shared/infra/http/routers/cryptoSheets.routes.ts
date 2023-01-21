import { Router } from 'express';
import multer from 'multer';

const upload = multer({dest: 'uploads/'});



// ###################### Middleware #########################
import { AccountVerifications } from '../middlewares/AccountVerificationsPG';

const accountVerifications = new AccountVerifications();

import { ParserCryptoController } from '@modules/crypto/useCases/parser/parserController';
import { ListSheetsController } from '@modules/crypto/useCases/listSheets/listSheetsController';
import { GetAssetOperationsController} from '@modules/crypto/useCases/getAssetOperations/getAssetOperationsController';
import { GetSheetSummaryController} from '@modules/crypto/useCases/getSheetSummary/getSheetSummaryController';
import { DeleteSheetController } from '@modules/crypto/useCases/deleteSheet/deleteSheetController';
import SaveSheetController from '@modules/crypto/useCases/saveSheet/SaveSheetController';

const getSheetController = new GetAssetOperationsController();
const listSheetsController = new ListSheetsController();
const getSheetSummaryController = new GetSheetSummaryController();
const parserSheetController = new ParserCryptoController();
const deleteSheetController = new DeleteSheetController();
const saveSheetController = new SaveSheetController();

// Instance for Router();
const cryptoSheetsRouter = Router();

cryptoSheetsRouter.use(accountVerifications.verifySession);

// Retrieves a list of all sheets parsed and stored
cryptoSheetsRouter.get(
	'/sheets',
	listSheetsController.handle
);

// Retrieves a specified sheet data from a user
cryptoSheetsRouter.get(
	'/sheet/:sheetName/:assetName/:sellShowMode',
	getSheetController.handle
);

cryptoSheetsRouter.get(
	'/sheetSummary/:sheetName',
	getSheetSummaryController.handle
);

// Parse sheets in the xlsx file uploaded and stores the data obtained
cryptoSheetsRouter.post(
	'/saveSheet/:overwrite',
	parserSheetController.handle
);



cryptoSheetsRouter.post(
	'/saveSheet2/:overwrite',
	upload.single('sheet'),
	saveSheetController.handle
);

// Delete given sheet's information of a user
cryptoSheetsRouter.delete(
	'/deleteSheet/:sheetName',
	deleteSheetController.handle
);

// --------------------------- Crypto Users ------------------------------

export { cryptoSheetsRouter };