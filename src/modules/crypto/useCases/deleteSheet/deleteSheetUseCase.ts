import { ICryptoRepository, IDeleteResponse } from '../../repositories/ICryptoRepository';

interface IRequest {
    userName: string;
    sheetName: string;
}

class DeleteSheetUseCase {
    constructor(private cryptoRepository: ICryptoRepository) {}

    async execute({ userName, sheetName }: IRequest): Promise<IDeleteResponse> {
        return await this.cryptoRepository.deleteSheet({ userName, sheetName });
    }
}

export { DeleteSheetUseCase };