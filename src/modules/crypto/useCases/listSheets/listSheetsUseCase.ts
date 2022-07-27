import { ICryptoRepository } from '../../repositories/ICryptoRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListSheetsUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute( user_id: string ): Promise<string[]> {
        return await this.cryptoRepository.listSheets(user_id);
    }
}

export { ListSheetsUseCase };