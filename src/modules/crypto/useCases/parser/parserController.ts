import { Request, Response } from 'express';
import { ParserCryptoUseCase } from './parserUseCase';

class ParserCryptoController {
    constructor(private parserCryptoUseCase: ParserCryptoUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> /* BAD - it should return a Response */ {
        const { username } = req.headers;
        const userName = username as string; // username has type string │ string[]
        
        const response = await this.parserCryptoUseCase.execute(userName);
        
        if (response.status === 201) {
            console.log("Controller received 201 - sending throught response");
            //const sheetNames = JSON.stringify(response.sheetsList);
            return res.status(201).json({ sheetList: response.sheetsList });
        }
        // Must handle errors
        else if (response.status === 500) {
            console.log("Controller received 500 - sending throught response");
            console.log(response.errorMessage);
            //return res.status(500).send(response.errorMessage);
            return res.status(500).json({ error: response.errorMessage});
        }
        else {
            console.log("No valid response received from parsing use case");
            console.log(response.errorMessage);
            //return res.status(500).send("Unknow error");
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}

export { ParserCryptoController };