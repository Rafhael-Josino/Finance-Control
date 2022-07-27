import { Request, Response } from 'express';
import { GetSheetSummaryUseCase } from './getSheetSummaryUseCase';
import { container } from 'tsyringe';

class GetSheetSummaryController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { sheetName } = req.params;
        const { id: userID } = req.user;

        const getSheetSummaryUseCase = container.resolve(GetSheetSummaryUseCase);

        const response = await getSheetSummaryUseCase.execute({ sheetName, userID });

        return res.json({
            sheetSummary: response
        });
    }
}

export { GetSheetSummaryController };