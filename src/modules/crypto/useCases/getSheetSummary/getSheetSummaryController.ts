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

        if (response.status === 200) {
            return res.send(response.sheetSummary);
        }
        else if (response.status === 404) {
            return res.status(404).json({ error: response.errorMessage});
        }
        else if (response.status === 500) {
            return res.status(500).json({ error: response.errorMessage});
        }
        else {
            console.log("No valid response received from parsing use case");
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}

export { GetSheetSummaryController };