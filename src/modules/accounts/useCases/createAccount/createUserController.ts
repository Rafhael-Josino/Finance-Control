import { Request, Response } from 'express';
import { CreateUserUseCase } from './createUserUseCase';
import { container } from 'tsyringe';

class CreateUserController {
    async handle(req: Request, res: Response): Promise<Response> {
        //const { username } = req.headers;
        //const userName = username as string; // username has type string │ string[]

        const { userName, password } = req.body;

        const createUserUseCase = container.resolve(CreateUserUseCase);

        await createUserUseCase.execute({ userName, password });

        return res.status(201).send();
    }
}

export { CreateUserController };