import { ICryptoRepository, ICryptoSummary } from '../../repositories/ICryptoRepository';
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

    async execute({ userName, sheetName }: IRequest): Promise<ICryptoSummary> {
        return await this.cryptoRepository.getSheetSummary({ userName, sheetName });
    }
}

export { GetSheetSummaryUseCase };