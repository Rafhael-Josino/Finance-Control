import { Request, Response } from 'express';
import { DeleteUserUseCase } from './deleteUserUseCase';
import { container } from "tsyringe";

class DeleteUserController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]

        const deleteUserUseCase = container.resolve(DeleteUserUseCase);

        const response = await deleteUserUseCase.execute(userName);

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