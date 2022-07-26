import { ICryptoRepository } from '../../repositories/ICryptoRepository';
import { CryptoSummary } from '../../models/Cryptos';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    userName: string;
    sheetName: string;
}

@injectable()
class GetSheetSummaryUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute({ userName, sheetName }: IRequest): Promise<CryptoSummary[]> {
        return await this.cryptoRepository.getSheetSummary({ userName, sheetName });
    }
}

export { GetSheetSummaryUseCase };