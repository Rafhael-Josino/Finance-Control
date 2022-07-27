import { ICryptoRepository, IGetSheetResponse } from '../../repositories/ICryptoRepository';
import { inject, injectable } from "tsyringe";

interface IRequest {
    userID: string;
    sheetName: string;
    assetName: string;
}

@injectable()
class GetSheetUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute({ userID, sheetName, assetName }: IRequest): Promise<IGetSheetResponse> {
        return await this.cryptoRepository.getSheet({ userID, sheetName, assetName });
    }
}

export { GetSheetUseCase };