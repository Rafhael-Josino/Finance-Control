import { Router } from 'express';

import { CryptoUserVerifications } from '../middlewares/AccountVerificationsPG';

const cryptoUserVerifications = new CryptoUserVerifications();

import { CreateUserController } from '../modules/accounts/useCases/createAccount/createUserController';
import { DeleteUserController } from '../modules/accounts/useCases/deleteAccount.ts/deleteUserController';
import { GetUserController } from '../modules/accounts/useCases/getAccount/getUserController';
import { ListUsersController } from '../modules/accounts/useCases/listAccounts/ListUsersController';

const getUserController = new GetUserController();
const listUsersController = new ListUsersController();
const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();

const accountRouter = Router();

// List users
accountRouter.get(
	'/list',
	listUsersController.handle
);

accountRouter.post(
	'/',
	cryptoUserVerifications.verifyUserAlreadyExists,
	createUserController.handle
);

// Retrieves the crypto user data
accountRouter.get(
	'/',
	cryptoUserVerifications.verifyUserExists,
	getUserController.handle	
);

// Deletes user
accountRouter.delete(
	'/',
	cryptoUserVerifications.verifyUserExists,
	deleteUserController.handle
);

export { accountRouter }