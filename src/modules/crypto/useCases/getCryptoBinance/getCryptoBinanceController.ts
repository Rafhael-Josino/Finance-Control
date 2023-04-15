import { Request, Response } from 'express';
import { GetCryptoBinanceUseCase } from './getCryptoBinanceUseCase';

class GetCryptoBinanceController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { asset } = req.headers;
        
        const getCryptoBinanceUseCase = new GetCryptoBinanceUseCase();

        const assets = await getCryptoBinanceUseCase.execute();

        return res.json({ assets });
    }
}

export { GetCryptoBinanceController }