import { Request, Response } from 'express';
import { ListSheetsUseCase } from './listSheetsUseCase';
import { container } from 'tsyringe';

class ListSheetsController {
    async handle(req: Request, res: Response): Promise<Response> {
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]

        const listSheetsUseCase = container.resolve(ListSheetsUseCase);

        const response = await listSheetsUseCase.execute(userName);

        return res.json({
            sheetList: response
        });
    }
}

export { ListSheetsController };