import { ICryptoRepository, IDeleteResponse } from '../../repositories/ICryptoRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    userName: string;
    sheetName: string;
}

@injectable()
class DeleteSheetUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute({ userName, sheetName }: IRequest): Promise<IDeleteResponse> {
        return await this.cryptoRepository.deleteSheet({ userName, sheetName });
    }
}

export { DeleteSheetUseCase };