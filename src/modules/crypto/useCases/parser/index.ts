import { CryptoRepositoryPG } from '../../repositories/implementations/CryptoRepositoryPG';
import { ParserCryptoUseCase } from './parserUseCase';
import { ParserCryptoController } from './parserController';

const cryptoRepository = new CryptoRepositoryPG();
const parserCryptoUseCase = new ParserCryptoUseCase(cryptoRepository);
const parserCryptoController = new ParserCryptoController(parserCryptoUseCase);

export { parserCryptoController };
