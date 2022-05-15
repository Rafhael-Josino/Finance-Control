import { ICryptoRepository, ICryptoSummary } from '../../repositories/ICryptoRepository';

interface IRequest {
    userName: string;
    sheetName: string;
}

class GetSheetSummaryUseCase {
    constructor(private cryptoRepository: ICryptoRepository) {}

    async execute({ userName, sheetName }: IRequest): Promise<ICryptoSummary> {
        return await this.cryptoRepository.getSheetSummary({ userName, sheetName });
    }
}

export { GetSheetSummaryUseCase };