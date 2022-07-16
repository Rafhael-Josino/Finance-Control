import { ICryptoRepository, ICryptoAsset } from '../../repositories/ICryptoRepository';
import { inject, injectable } from "tsyringe";

interface IRequest {
    userName: string;
    sheetName: string;
    assetName: string;
}

@injectable()
class GetSheetUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute({ userName, sheetName, assetName }: IRequest): Promise<ICryptoAsset> {
        return await this.cryptoRepository.getSheet({ userName, sheetName, assetName });
    }
}

export { GetSheetUseCase };