import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListTransactionsUseCase } from "./listTransactionsUseCase";

class ListTransactionsController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { id: userID } = req.user; // Received from middleware

        const listTransactionsUseCase = container.resolve(ListTransactionsUseCase);

        const transactions = await listTransactionsUseCase.execute(userID);

        return res.json({ transactions });
    }
}

export { ListTransactionsController }