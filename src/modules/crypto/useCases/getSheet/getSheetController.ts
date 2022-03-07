import { Request, Response } from 'express';
import { GetSheetUseCase } from './getSheetUseCase';

class GetSheetController {
    constructor(private getSheetUseCase: GetSheetUseCase) {}

    handle(req: Request, res: Response): Response {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { sheetName } = req.params;
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]
        
        const response = this.getSheetUseCase.execute({ sheetName, userName });

        if (response.status === 200) {
            const sheetNames = JSON.stringify(response.sheet);
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

export { GetSheetController };