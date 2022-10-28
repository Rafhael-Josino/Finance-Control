import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransactionUseCase } from "./createTransactionUseCase";

class CreateTransactionController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { id: userID } = req.user; // Received from middleware
        const { description, value, date } = req.body;

        // Put input control

        const createTransactionUseCase = container.resolve(CreateTransactionUseCase);

        const newTransaction = await createTransactionUseCase.execute({
            description,
            value,
            date,
            userID,
        });

        return res.status(201).json({ newTransaction }); 
    }
}

export { CreateTransactionController }