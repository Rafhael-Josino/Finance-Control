import { Request, Response } from 'express';
import { ParserCryptoUseCase } from './parserUseCase';
import { container } from 'tsyringe';
import { AppError } from '@shared/errors/AppErrors';

class ParserCryptoController {
    async handle(req: Request, res: Response): Promise<Response> /* BAD - it should return a Response */ {
        const { username } = req.headers;
        const { id: userID } = req.user;
        const { overwrite } = req.params;

        if (overwrite !== "yes" && overwrite !== "no")
            throw new AppError("overwrite parameter must be 'yes' or 'no'", 400);

        const parserCryptoUseCase = container.resolve(ParserCryptoUseCase);

        const response = await parserCryptoUseCase.execute({ username, userID, overwrite });

        return res.json({
            sheetsParsed: response
        });
    }
}

export { ParserCryptoController };