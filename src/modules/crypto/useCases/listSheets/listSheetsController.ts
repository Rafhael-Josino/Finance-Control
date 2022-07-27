import { Request, Response } from 'express';
import { ListSheetsUseCase } from './listSheetsUseCase';
import { container } from 'tsyringe';

class ListSheetsController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.user;

        const listSheetsUseCase = container.resolve(ListSheetsUseCase);

        const response = await listSheetsUseCase.execute(id);

        return res.json({
            sheetList: response
        });
    }
}

export { ListSheetsController };