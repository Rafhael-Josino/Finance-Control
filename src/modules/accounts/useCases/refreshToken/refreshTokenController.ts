import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RefreshTokenUseCase } from './refreshTokenUseCase';

class RefreshTokenController {
    async handle(req: Request, res: Response): Promise<Response> {
        const present_refresh_token = 
            req.body.refresh_token ||
            req.headers["x-access-token"] ||
            req.query.token;

        const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

        const { refresh_token, token } = await refreshTokenUseCase.execute(present_refresh_token);

        return res.json({ refresh_token, token });
    }
}

export { RefreshTokenController }