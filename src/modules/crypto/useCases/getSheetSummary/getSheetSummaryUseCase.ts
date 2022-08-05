import { ICryptoRepository } from '../../repositories/ICryptoRepository';
import { CryptoSummary } from '../../infra/postgresSQL/models/Cryptos';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    userID: string;
    sheetName: string;
}

@injectable()
class GetSheetSummaryUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute({ userID, sheetName }: IRequest): Promise<CryptoSummary[]> {
        return await this.cryptoRepository.getSheetSummary({ userID, sheetName });
    }
}

export { GetSheetSummaryUseCase };