import { Request, Response } from 'express';
import { DeleteUserUseCase } from './deleteUserUseCase';

class DeleteUserController {
    constructor(private deleteUserUseCase: DeleteUserUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]
        
        const response = await this.deleteUserUseCase.execute(userName);

        if (response.status === 204) {
            return res.status(204).send("User deleted successfully");
        }
        else if (response.status === 500) {
            return res.status(500).json({ error: response.errorMessage });
        }
        else {
            console.log("No valid response received from parsing use case");
            return res.status(500).json({ error: "No valid response received from parsing use case" });
        }
    }
}

export { DeleteUserController };