import { ICryptoRepository, ICryptoResponse } from '../../repositories/ICryptoRepository';

interface IRequest {
    userName: string;
    sheetName: string;
}

class GetSheetUseCase {
    constructor(private cryptoRepository: ICryptoRepository) {}

    async execute({ userName, sheetName }: IRequest): Promise<ICryptoResponse> {
        return await this.cryptoRepository.getSheet({ userName, sheetName });
    }
}

export { GetSheetUseCase };