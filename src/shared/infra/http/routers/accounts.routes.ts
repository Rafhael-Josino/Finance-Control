import { Router } from 'express';

import { AccountVerifications } from '../middlewares/AccountVerificationsPG';

const accountVerifications = new AccountVerifications();

import { CreateUserController } from '@modules/accounts/useCases/createAccount/createUserController';
import { DeleteUserController } from '@modules/accounts/useCases/deleteAccount/deleteUserController';
import { GetUserController } from '@modules/accounts/useCases/getAccount/getUserController';
import { ListUsersController } from '@modules/accounts/useCases/listAccounts/ListUsersController';
import { SessionController } from '@modules/accounts/useCases/authenticateAccount/sessionController';

const getUserController = new GetUserController();
const listUsersController = new ListUsersController();
const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();
const sessionController = new SessionController();

const accountRouter = Router();

accountRouter.post(
	'/login',
	sessionController.handle
);

accountRouter.use(accountVerifications.verifySession);
accountRouter.use(accountVerifications.verifyAdmin);

// List users
accountRouter.get(
	'/list',
	listUsersController.handle
);

// Creates new user account
accountRouter.post(
	'/',
	createUserController.handle
);

// Retrieves user account data
accountRouter.get(
	'/',
	accountVerifications.verifyUserExists,
	getUserController.handle	
);

// Deletes user account
accountRouter.delete(
	'/',
	accountVerifications.verifyUserExists,
	deleteUserController.handle
);

export { accountRouter }