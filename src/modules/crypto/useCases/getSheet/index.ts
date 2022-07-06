import { CryptoRepositoryPG as CryptoRepository } from '../../repositories/implementations/CryptoRepositoryPG';
import { GetSheetUseCase } from './getSheetUseCase';
import { GetSheetController} from './getSheetController';

const cryptoRepository = new CryptoRepository();
const getSheetUseCase = new GetSheetUseCase(cryptoRepository);
const getSheetController = new GetSheetController(getSheetUseCase);

export { getSheetController };