import { Request, Response } from 'express';
import { GetUserUseCase } from './getUserUseCase';

class GetUserController {
    constructor(private getUserUseCase: GetUserUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { username } = req.params; // Must adjust in crypto.ts
        const userName = username as string; // username has type string │ string[]
        
        const response = await this.getUserUseCase.execute(userName);

        if (response.status === 200) {
            return res.status(200).json({ user: response.cryptoUser });
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