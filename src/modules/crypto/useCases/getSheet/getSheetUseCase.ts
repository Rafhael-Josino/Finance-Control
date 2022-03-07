import { ICryptoRepository, ICryptoResponse } from '../../repositories/ICryptoRepository';

interface IRequest {
    userName: string;
    sheetName: string;
}

class GetSheetUseCase {
    constructor(private cryptoRepository: ICryptoRepository) {}

    execute({ userName, sheetName }: IRequest): ICryptoResponse {
        return this.cryptoRepository.getSheet({ userName, sheetName });
    }
}

export { GetSheetUseCase };