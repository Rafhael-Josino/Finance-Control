import { Router } from 'express';

import { CryptoUserVerifications } from '../middlewares/CryptoUserVerificationsPG';

const cryptoUserVerifications = new CryptoUserVerifications();

import { CreateUserController } from '../modules/crypto/useCases/createUser/createUserController';
import { DeleteUserController } from '../modules/crypto/useCases/deleteUser/deleteUserController';
import { GetUserController } from '../modules/crypto/useCases/getUser/getUserController';
import { ListUsersController } from '../modules/crypto/useCases/listUsers/ListUsersController';

const getUserController = new GetUserController();
const listUsersController = new ListUsersController();
const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();

const accountRouter = Router();

// List users
accountRouter.get(
	'/users',
	listUsersController.handle
);

accountRouter.post(
	'/user',
	cryptoUserVerifications.verifyUserAlreadyExists,
	createUserController.handle
);

// Retrieves the crypto user data
accountRouter.get(
	'/user',
	cryptoUserVerifications.verifyUserExists,
	getUserController.handle	
);

// Deletes user
accountRouter.delete(
	'/user',
	cryptoUserVerifications.verifyUserExists,
	deleteUserController.handle
);

export { accountRouter }