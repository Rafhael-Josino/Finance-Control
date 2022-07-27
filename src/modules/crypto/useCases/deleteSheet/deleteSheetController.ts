import { Request, Response } from 'express';
import { DeleteSheetUseCase } from './deleteSheetUseCase';
import { container } from 'tsyringe';

class DeleteSheetController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { sheetName } = req.params;
        const { id: userID } = req.user;

        const deleteSheetUseCase = container.resolve(DeleteSheetUseCase);

        await deleteSheetUseCase.execute({ userID, sheetName });

        return res.status(204).send();
    }
}

export { DeleteSheetController };