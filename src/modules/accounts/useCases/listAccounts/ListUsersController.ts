import { Request, Response } from 'express';
import { ListUsersUseCase } from './listUsersUseCase';
import { container } from 'tsyringe';

class ListUsersController {
    async handle(req: Request, res: Response): Promise<Response> /* BAD - it should return a Response */ {
        //const { username } = req.headers;
        //const userName = username as string; // username has type string │ string[]    

        const listUsersUseCase = container.resolve(ListUsersUseCase);

        const response = await listUsersUseCase.execute();

        if (response.status === 200) {
            console.log("List Users Controller received 200 - sending throught response");
            const usersList = JSON.stringify(response.usersList);
            return res.send(usersList);
        }
        // Must handle errors
        else if (response.status === 500) {
            console.log("List Users Controller received 500 - sending throught response");
            console.log(response.errorMessage);
            //return res.status(500).send(response.errorMessage);
            return res.status(500).json({ error: response.errorMessage});
        }
        else {
            console.log("No valid response received from List Users case");
            console.log(response.errorMessage);
            //return res.status(500).send("Unknow error");
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}

export { ListUsersController };