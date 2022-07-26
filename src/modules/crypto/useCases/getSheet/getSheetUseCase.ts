import { ICryptoRepository, IGetSheetResponse } from '../../repositories/ICryptoRepository';
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

    async execute({ userName, sheetName, assetName }: IRequest): Promise<IGetSheetResponse> {
        return await this.cryptoRepository.getSheet({ userName, sheetName, assetName });
    }
}

export { GetSheetUseCase };