import { Request, Response } from 'express';
import { GetSheetUseCase } from './getSheetUseCase';
import { container } from "tsyringe";

class GetSheetController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { sheetName, assetName } = req.params;
        const { id: userID } = req.user;
        
        const getSheetUseCase = container.resolve(GetSheetUseCase);

        const response = await getSheetUseCase.execute({ sheetName, userID, assetName });

        return res.json({
            purchases: response.purchases,
            sells: response.sells
        });
    }
}

export { GetSheetController };