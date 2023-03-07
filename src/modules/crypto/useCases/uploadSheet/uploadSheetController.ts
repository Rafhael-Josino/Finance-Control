import { Request, Response } from 'express';
import { UploadSheetUseCase } from './uploadSheetUseCase';
import { container } from 'tsyringe';
import { AppError } from '@shared/errors/AppErrors';

class UploadSheetController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { username } = req.headers;
        const { id: userID } = req.user; // received from middleware
        const { overwrite } = req.params;
        const file = req.file;

        if (!file) {
            throw new AppError('file not received', 400);
        }
        
        if (!file.filename.match('.xlsx')) {
            throw new AppError('file must have format XLSX', 400);
        }

        if (overwrite !== "yes" && overwrite !== "no")
            throw new AppError("overwrite parameter must be 'yes' or 'no'", 400);

        const uploadSheetUseCase = container.resolve(UploadSheetUseCase);

        const response = await uploadSheetUseCase.execute({ username, userID, overwrite });

        return res.json({
            sheetsParsed: response
        });
    }
}

export { UploadSheetController };