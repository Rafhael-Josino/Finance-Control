import { Router } from 'express';
import { AccountVerifications } from '../middlewares/AccountVerificationsPG';

const accountVerifications = new AccountVerifications();

import { CreateUserController } from '@modules/accounts/useCases/createAccount/createUserController';
import { DeleteUserController } from '@modules/accounts/useCases/deleteAccount/deleteUserController';
import { GetUserController } from '@modules/accounts/useCases/getAccount/getUserController';
import { ListUsersController } from '@modules/accounts/useCases/listAccounts/ListUsersController';
import { SessionController } from '@modules/accounts/useCases/authenticateAccount/sessionController';
import { RefreshTokenController } from '@modules/accounts/useCases/refreshToken/refreshTokenController';

const getUserController = new GetUserController();
const listUsersController = new ListUsersController();
const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();
const sessionController = new SessionController();
const refreshTokenController = new RefreshTokenController();

const accountRouter = Router();


accountRouter.post('/login', sessionController.handle);
accountRouter.post('/refreshLogin', refreshTokenController.handle);

// Creates new user account
accountRouter.post('/', createUserController.handle);

accountRouter.use(accountVerifications.verifySession);
//accountRouter.use(accountVerifications.verifyAdmin);

// List users
accountRouter.get('/list', accountVerifications.verifyAdmin, listUsersController.handle);

accountRouter.use(accountVerifications.verifyAdminOrOwner);

// Retrieves user account data
accountRouter.get('/', getUserController.handle);

// Deletes user account
accountRouter.delete('/', deleteUserController.handle);

export { accountRouter }