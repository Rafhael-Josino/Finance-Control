import { Request, Response } from 'express';
import { GetSheetUseCase } from './getSheetUseCase';
import { container } from "tsyringe";

class GetSheetController {
    async handle(req: Request, res: Response): Promise<Response> {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { sheetName, assetName } = req.params;
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]
        
        const getSheetUseCase = container.resolve(GetSheetUseCase);

        const response = await getSheetUseCase.execute({ sheetName, userName, assetName });

        return res.json({
            purchases: response.purchases,
            sells: response.sells
        });
    }
}

export { GetSheetController };