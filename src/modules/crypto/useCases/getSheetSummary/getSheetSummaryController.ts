import { Request, Response } from 'express';
import { GetSheetSummaryUseCase } from './getSheetSummaryUseCase';
import { container } from 'tsyringe';

class GetSheetSummaryController {
    async handle(req: Request, res: Response): Promise<Response> {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { sheetName } = req.params;
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]

        const getSheetSummaryUseCase = container.resolve(GetSheetSummaryUseCase);

        const response = await getSheetSummaryUseCase.execute({ sheetName, userName });

        return res.json({
            sheetSummary: response
        });
    }
}

export { GetSheetSummaryController };