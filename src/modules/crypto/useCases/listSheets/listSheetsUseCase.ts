import { ICryptoRepository, ICryptoListSheetsResponse } from '../../repositories/ICryptoRepository';

class ListSheetsUseCase {
    constructor(private cryptoRepository: ICryptoRepository) {}

    async execute( userName: string ): Promise<ICryptoListSheetsResponse> {
        return await this.cryptoRepository.listSheets(userName);
    }
}

export { ListSheetsUseCase };