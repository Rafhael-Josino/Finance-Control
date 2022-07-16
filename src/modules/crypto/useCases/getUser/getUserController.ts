import { Request, Response } from 'express';
import { GetUserUseCase } from './getUserUseCase';
import { container } from 'tsyringe';

class GetUserController {
    async handle(req: Request, res: Response): Promise<Response> {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { username } = req.headers; // Must adjust in crypto.ts
        const userName = username as string; // username has type string │ string[]

        const getUserUseCase = container.resolve(GetUserUseCase);

        const response = await getUserUseCase.execute(userName);

        if (response.status === 200) {
            return res.status(200).json(response.cryptoUser);
        }
        else if (response.status === 500) {
            return res.status(500).json({ error: response.errorMessage });
        }
        else {
            console.log("No valid response received from Get User use case");
            return res.status(500).json({ error: "Unknown error" });
        }
        
    }
}

export { GetUserController };