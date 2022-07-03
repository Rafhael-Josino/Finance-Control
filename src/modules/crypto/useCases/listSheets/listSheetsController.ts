import { Request, Response } from 'express';
import { ListSheetsUseCase } from './listSheetsUseCase';

class ListSheetsController {
    constructor(private listSheetsUseCase: ListSheetsUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]
        
        const response = await this.listSheetsUseCase.execute(userName);

        if (response.status === 200) {
            const sheetNames = JSON.stringify(response.sheetList);
            return res.send(sheetNames);
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

export { ListSheetsController };