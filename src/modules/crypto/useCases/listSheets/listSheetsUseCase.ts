import { inject, injectable } from 'tsyringe';
import { ICryptoRepository } from '../../repositories/ICryptoRepository';
import { SheetListType } from '@modules/crypto/infra/models/CryptoTypes';

@injectable()
class ListSheetsUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute( user_id: string ): Promise<SheetListType[]> {
        return await this.cryptoRepository.listSheets(user_id);
    }
}

export { ListSheetsUseCase };