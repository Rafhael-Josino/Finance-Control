import { Request, Response } from 'express';
import { GetSheetUseCase } from './getSheetUseCase';
import { container } from "tsyringe";
import { AppError } from '@shared/errors/AppErrors';

/**
 * Request params:
 * sheetName: Name of sheet parsed for search in the databank
 * assetName: Name of the cryptocoin for search in the databank
 * sellsMonthlyResumed: if true, instead of each sell of the cryptocoin,
 *                      it will be returned the total received and the 
 *                      respective amount spent to the sell WITH PROFIT ONLY,
 */

class GetSheetController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { sheetName, assetName, sellsMonthlyResumed } = req.params;
        const { id: userID } = req.user;
        
        if (sellsMonthlyResumed !== 'yes' && sellsMonthlyResumed !== 'no') {
            throw new AppError('sellsMonthlyResumed param must be "yes" or "no', 400);
        }

        const getSheetUseCase = container.resolve(GetSheetUseCase);

        const { asset, purchases, sells } = await getSheetUseCase.execute({ sheetName, userID, assetName, sellsMonthlyResumed });

        console.log(sells)

        return res.json({ asset, purchases, sells });
    }
}

export { GetSheetController };