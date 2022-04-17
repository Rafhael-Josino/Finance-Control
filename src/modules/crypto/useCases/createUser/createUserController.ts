import { Request, Response } from 'express';
import { CreateUserUseCase } from './createUserUseCase';

class CreateUserController {
    constructor(private createUserUseCase: CreateUserUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]
        
        const response = await this.createUserUseCase.execute(userName);

        if (response.status === 201) {
            return res.status(201).json({ newUser: response.cryptoUser });
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