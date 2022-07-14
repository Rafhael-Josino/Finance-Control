import { Request, Response } from 'express';
import { CreateUserUseCase } from './createUserUseCase';
import { container } from 'tsyringe';

class CreateUserController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]

        const createUserUseCase = container.resolve(CreateUserUseCase);

        const response = await createUserUseCase.execute(userName);

        if (response.status === 201) {
            return res.status(201).json({ newUser: response.message });
        }
        else if (response.status === 500) {
            return res.status(500).json({ error: response.errorMessage });
        }
        else {
            console.log("No valid response received from parsing use case");
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}

export { CreateUserController };