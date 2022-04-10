import { Request, Response } from 'express';
import { ListUsersUseCase } from './listUsersUseCase';

class ListUsersController {
    constructor(private listUsersUseCase: ListUsersUseCase) {}

    handle(req: Request, res: Response): Response /* BAD - it should return a Response */ {
        //const { username } = req.headers;
        //const userName = username as string; // username has type string │ string[]    
        
        const response = this.listUsersUseCase.execute();

        if (response.status === 200) {
            console.log("Controller received 201 - sending throught response");
            //const sheetNames = JSON.stringify(response.sheetsList);
            return res.status(200).json({ sheetList: response.usersList });
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

export { ListUsersController };