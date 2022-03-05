import { Request, Response } from 'express';
import { ParserCryptoUseCase } from './parserUseCase';

class ParserCryptoController {
    constructor(private parserCryptoUseCase: ParserCryptoUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> /* BAD - it should return a Response */ {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        const { userName } = req.params; // Fix to get parameter from header

        const response = await this.parserCryptoUseCase.execute(userName);
        
        if (response.status === 201) {
            console.log("Controller received 201 - sending throught response");
            return res.status(201).send();
        }
        // Must handle errors
        else if (response.status === 500) {
            console.log("Controller received 500 - sending throught response");
            console.log(response.message);
            return res.status(500).send(response.message);
        }
        else {
            console.log("No valid response received from parsing use case");
            console.log(response.message);
            return res.status(500).send("Unknow error");
        }
    }
}

export { ParserCryptoController };