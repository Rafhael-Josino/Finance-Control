import { Request, Response } from 'express';
import { GetSheetUseCase } from './getSheetUseCase';

class GetSheetController {
    constructor(private getSheetUseCase: GetSheetUseCase) {}

    handle(req: Request, res: Response): void {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { userName, sheetName } = req.params
        
        this.getSheetUseCase.execute({ userName, sheetName, res});
    }
}

export { GetSheetController };