import { Request, Response } from 'express';
import { DeleteSheetUseCase } from './deleteSheetUseCase';
import { container } from 'tsyringe';

class DeleteSheetController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { sheetName } = req.params;
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]
        
        const deleteSheetUseCase = container.resolve(DeleteSheetUseCase);

        await deleteSheetUseCase.execute({ userName, sheetName });

        return res.status(204).send();
    }
}

export { DeleteSheetController };