import { Request, Response } from 'express';
import { ParserCryptoUseCase } from './parserUseCase';

class ParserCryptoController {
    constructor(private parserCryptoUseCase: ParserCryptoUseCase) {}

    handle(req: Request, res: Response): void /* BAD - it should return a Response */ {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        const { userName } = req.params; // Must adjust in crypto.ts

        this.parserCryptoUseCase.execute({userName, res});
        
        // Must handle errors

        // It sends the response before the execute above finishes!!!
        //res.status(200).send() // How to synchronize that?
    }
}

export { ParserCryptoController };