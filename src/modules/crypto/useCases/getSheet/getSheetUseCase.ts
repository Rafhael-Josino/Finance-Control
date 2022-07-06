import { ICryptoRepository, ICryptoAsset } from '../../repositories/ICryptoRepository';

interface IRequest {
    userName: string;
    sheetName: string;
    assetName: string;
}

class GetSheetUseCase {
    constructor(private cryptoRepository: ICryptoRepository) {}

    async execute({ userName, sheetName, assetName }: IRequest): Promise<ICryptoAsset> {
        return await this.cryptoRepository.getSheet({ userName, sheetName, assetName });
    }
}

export { GetSheetUseCase };