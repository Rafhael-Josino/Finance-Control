import { Request, Response } from 'express';
import { GetSheetNamesUseCase } from './getSheetNamesUseCase';

class GetSheetNamesController {
    constructor(private getSheetNamesUseCase: GetSheetNamesUseCase) {}

    handle(req: Request, res: Response): void {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { user } = req.body; // Must adjust in crypto.ts
        
        this.getSheetNamesUseCase.execute({ user, res});
    }
}

export { GetSheetNamesController };