/*
Sheet's columns escription:
    A - Date
    B - Pair Asset/Coin evaluated
    C - Type of operation
    D - Operation medium price (formula or direct value)
    E - Total bought (formula or direct value -> fix to this)
    F - Total sold OR Tax (formula or direct value -> fix to this)
    G - Value paid (formula or direct value)
    H - Value received
    I - New asset's medium price
    J - Profit
    K - Operation's local
*/


import { inject, injectable } from 'tsyringe';
import { 
    ICryptoRepository,
} from '../../repositories/ICryptoRepository';
import { AppError } from '@shared/errors/AppErrors';

type IRequest = {
    username: string | string[],
    userID: string,
    overwrite: string,
    rawData: FormData,
}

@injectable()
class SaveSheetUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    // If this code will be used as a repository class, the return shall be an object with status e possible ok/error messages
    async execute( { username, userID, overwrite, rawData }: IRequest ) {
        console.log(rawData);

    }
}

export default SaveSheetUseCase;