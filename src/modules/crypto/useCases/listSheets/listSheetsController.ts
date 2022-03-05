import { Request, Response } from 'express';
import { ListSheetsUseCase } from './listSheetsUseCase';

class ListSheetsController {
    constructor(private listSheetsUseCase: ListSheetsUseCase) {}

    handle(req: Request, res: Response): Response {
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]
        
        const response = this.listSheetsUseCase.execute(userName);

        if (response.status === 200) {
            const sheetNames = JSON.stringify(response.sheetsList);
            return res.send(sheetNames);
        }
        else if (response.status === 500) {
            return res.status(500).json({ error: response.errorMessage});
        }
    }
}

export { ListSheetsController };