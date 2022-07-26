import { Request, Response } from 'express';
import { DeleteUserUseCase } from './deleteUserUseCase';
import { container } from "tsyringe";

class DeleteUserController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]

        const deleteUserUseCase = container.resolve(DeleteUserUseCase);

        await deleteUserUseCase.execute(userName);

        return res.status(204).send();
    }
}

export { DeleteUserController };