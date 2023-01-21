import { Request, Response } from 'express';
import SaveSheetUseCase from './SaveSheetUseCase';
import { container } from 'tsyringe';
import { AppError } from '@shared/errors/AppErrors';

class SaveSheetController {
    async handle(req: Request, res: Response): Promise<Response> /* BAD - it should return a Response */ {
        const { username } = req.headers;
        const { id: userID } = req.user; // received from middleware
        const { overwrite } = req.params;
        const { rawData } = req.body;
        const file = req.file;

        console.log('controller:\n', file);

        if (overwrite !== "yes" && overwrite !== "no")
            throw new AppError("overwrite parameter must be 'yes' or 'no'", 400);

        const parserCryptoUseCase = container.resolve(SaveSheetUseCase);

        const response = await parserCryptoUseCase.execute({ username, userID, overwrite, rawData });

        return res.json({
            sheetsParsed: response
        });
    }
}

export default SaveSheetController