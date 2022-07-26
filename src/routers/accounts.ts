import { Router } from 'express';

import { AccountVerifications } from '../middlewares/AccountVerificationsPG';

const accountVerifications = new AccountVerifications();

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
	accountVerifications.verifyUserAlreadyExists,
	createUserController.handle
);

// Retrieves the crypto user data
accountRouter.get(
	'/',
	accountVerifications.verifyUserExists,
	getUserController.handle	
);

// Deletes user
accountRouter.delete(
	'/',
	accountVerifications.verifyUserExists,
	deleteUserController.handle
);

export { accountRouter }