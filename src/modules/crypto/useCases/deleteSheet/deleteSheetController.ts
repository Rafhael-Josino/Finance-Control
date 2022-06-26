import { Request, Response } from 'express';
import { DeleteSheetUseCase } from './deleteSheetUseCase';

class DeleteSheetController {
    constructor(private deleteSheetUseCase: DeleteSheetUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { sheetName } = req.params;
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]
        
        const response = await this.deleteSheetUseCase.execute({ userName, sheetName });

        if (response.status === 204) {
            return res.status(204).send(`Sheet ${sheetName} deleted successfully`);
        }
        else if (response.status === 500) {
            return res.status(500).json({ error: response.message });
        }
        else {
            console.log("No valid response received from parsing use case");
            return res.status(500).json({ error: "No valid response received from parsing use case" });
        }
    }
}

export { DeleteSheetController };