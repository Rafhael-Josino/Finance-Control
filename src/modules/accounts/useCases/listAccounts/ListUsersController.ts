import { Request, Response } from 'express';
import { ListUsersUseCase } from './listUsersUseCase';
import { container } from 'tsyringe';

class ListUsersController {
    async handle(req: Request, res: Response): Promise<Response> /* BAD - it should return a Response */ {
        //const { username } = req.headers;
        //const userName = username as string; // username has type string │ string[]   
        // The user received can be necessary, but instead as a token of an authenticated session  

        const listUsersUseCase = container.resolve(ListUsersUseCase);

        const usersList = await listUsersUseCase.execute();

        return res.json({ usersList });
    }
}

export { ListUsersController };