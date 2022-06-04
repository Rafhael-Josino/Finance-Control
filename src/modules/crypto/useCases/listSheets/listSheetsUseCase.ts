import { ICryptoUserRepository, ICryptoListSheetsResponse } from '../../repositories/ICryptoUserRepository';

class ListSheetsUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    execute( userName: string ): ICryptoListSheetsResponse {
        return this.cryptoUserRepository.listSheets(userName);
    }
}

export { ListSheetsUseCase };