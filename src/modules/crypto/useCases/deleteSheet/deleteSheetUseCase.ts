import { ICryptoRepository } from '../../repositories/ICryptoRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    userID: string;
    sheetName: string;
}

@injectable()
class DeleteSheetUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute({ userID, sheetName }: IRequest): Promise<void> {
        await this.cryptoRepository.deleteSheet({ userID, sheetName });
    }
}

export { DeleteSheetUseCase };