import { ICryptoRepository, ICryptoListSheetsResponse } from '../../repositories/ICryptoRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListSheetsUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute( userName: string ): Promise<ICryptoListSheetsResponse> {
        return await this.cryptoRepository.listSheets(userName);
    }
}

export { ListSheetsUseCase };