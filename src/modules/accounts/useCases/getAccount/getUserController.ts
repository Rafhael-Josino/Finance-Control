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

        const user = await getUserUseCase.execute(userName);

        return res.json({ user });
    }
}

export { GetUserController };