import { Request, Response } from 'express';
import { CreateUserUseCase } from './createUserUseCase';
import { container } from 'tsyringe';

class CreateUserController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]

        const createUserUseCase = container.resolve(CreateUserUseCase);

        await createUserUseCase.execute(userName);

        return res.status(201).send();
    }
}

export { CreateUserController };