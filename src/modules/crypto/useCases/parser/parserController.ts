import { Request, Response } from 'express';
import { ParserCryptoUseCase } from './parserUseCase';

class ParserCryptoController {
    constructor(private parserCryptoUseCase: ParserCryptoUseCase) {}

    handle(req: Request, res: Response): void /* BAD - it should return a Response */ {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        const { user } = req.body; // Must adjust in crypto.ts
        const { sheetName } = req.params;

        this.parserCryptoUseCase.execute({user, sheetName, res});
        
        // Must handle errors

        // It sends the response before the execute above finishes!!!
        //res.status(200).send() // How to synchronize that?
    }
}

export { ParserCryptoController };