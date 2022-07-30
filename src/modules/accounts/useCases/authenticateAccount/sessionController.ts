import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { SessionUseCase } from './sessionUseCase';

class SessionController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { userName, password } = req.body;

        const sessionUseCase = container.resolve(SessionUseCase);

        const { token } = await sessionUseCase.execute({ userName, password});

        return res.json({ userName, token });
    }
}

export { SessionController };