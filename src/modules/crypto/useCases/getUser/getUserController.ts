import { Request, Response } from 'express';
import { GetUserUseCase } from './getUserUseCase';

class GetUserController {
    constructor(private getUserUseCase: GetUserUseCase) {}

    handle(req: Request, res: Response): void {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { userName } = req.params; // Must adjust in crypto.ts
        
        this.getUserUseCase.execute({ userName, res});
    }
}

export { GetUserController };