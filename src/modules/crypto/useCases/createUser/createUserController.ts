import { Request, Response } from 'express';
import { CreateUserUseCase } from './createUserUseCase';

class CreateUserController {
    constructor(private createUserUseCase: CreateUserUseCase) {}

    handle(req: Request, res: Response): void {
        //const { user } = req.headers; // headers parameters are considerated as possibles arrays????
        //cont { user } = req; // with middleware. Only this is not working. User not part of req's type
        const { userName } = req.body; // Must adjust in crypto.ts
        
        this.createUserUseCase.execute({ userName, res});
    }
}

export { CreateUserController };