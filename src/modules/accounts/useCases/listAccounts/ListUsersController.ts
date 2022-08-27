import { Request, Response } from 'express';
import { ListUsersUseCase } from './listUsersUseCase';
import { container } from 'tsyringe';

class ListUsersController {
    async handle(req: Request, res: Response): Promise<Response> /* BAD - it should return a Response */ {
        const listUsersUseCase = container.resolve(ListUsersUseCase);

        const accountsList = await listUsersUseCase.execute();

        return res.json({ accountsList });
    }
}

export { ListUsersController };