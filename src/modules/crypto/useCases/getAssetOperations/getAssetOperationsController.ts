import { Request, Response } from 'express';
import { GetAssetOperationsUseCase } from './getAssetOperationsUseCase';
import { container } from "tsyringe";
import { AppError } from '@shared/errors/AppErrors';

/**
 * Request params:
 * sheetName: Name of sheet parsed for search in the databank
 * assetName: Name of the cryptocoin for search in the databank
 * sellShowMode: if 'month', instead of each sell of the cryptocoin,
 *               it will be returned the total received and the 
 *               respective amount spent of the sells WITH PROFIT ONLY,
 */

class GetAssetOperationsController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { sheetName, assetName, sellShowMode } = req.params;
        const { id: userID } = req.user;
        
        console.log(sellShowMode)

        if (sellShowMode !== 'month' && sellShowMode !== 'individual') {
            throw new AppError('sellShowMode param must be "month" or "individual"', 400);
        }

        const getSheetUseCase = container.resolve(GetAssetOperationsUseCase);

        const { asset, purchases, sells } = await getSheetUseCase.execute({ sheetName, userID, assetName, sellShowMode });

        console.log(sells)

        return res.json({ asset, purchases, sells });
    }
}

export { GetAssetOperationsController };