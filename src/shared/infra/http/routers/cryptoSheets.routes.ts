import { Router } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb (null, './tmp/uploads');
	},
	filename: (req, file, cb) => {
		cb (null, 'cryptoSheet.xlsx');
	}
});

const upload = multer({ storage });


// ###################### Middleware #########################
import { AccountVerifications } from '../middlewares/AccountVerificationsPG';

const accountVerifications = new AccountVerifications();

import { UploadSheetController } from '@modules/crypto/useCases/uploadSheet/uploadSheetController';
import { ListSheetsController } from '@modules/crypto/useCases/listSheets/listSheetsController';
import { GetAssetOperationsController} from '@modules/crypto/useCases/getAssetOperations/getAssetOperationsController';
import { GetSheetSummaryController} from '@modules/crypto/useCases/getSheetSummary/getSheetSummaryController';
import { DeleteSheetController } from '@modules/crypto/useCases/deleteSheet/deleteSheetController';
import { GetCryptoBinanceController } from '@modules/crypto/useCases/getCryptoBinance/getCryptoBinanceController';

const getSheetController = new GetAssetOperationsController();
const listSheetsController = new ListSheetsController();
const getSheetSummaryController = new GetSheetSummaryController();
const uploadSheetController = new UploadSheetController();
const deleteSheetController = new DeleteSheetController();
const getCryptoBinanceController = new GetCryptoBinanceController();

// Instance for Router();
const cryptoSheetsRouter = Router();


cryptoSheetsRouter.use(accountVerifications.verifySession);

// Retrieves the Binance's wallet information through Binance's API
// The API's keys are fixed yet
cryptoSheetsRouter.get(
	'/binance',
	getCryptoBinanceController.handle
);

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
	upload.single('sheet'),
	uploadSheetController.handle
);

// Delete given sheet's information of a user
cryptoSheetsRouter.delete(
	'/deleteSheet/:sheetName',
	deleteSheetController.handle
);

// --------------------------- Crypto Users ------------------------------

export { cryptoSheetsRouter };