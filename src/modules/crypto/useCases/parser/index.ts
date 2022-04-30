import { CryptoRepositoryJSON } from '../../repositories/implementations/CryptoRepositoryJSON';
import { ParserCryptoUseCase } from './parserUseCase';
import { ParserCryptoController } from './parserController';

const cryptoRepository = new CryptoRepositoryJSON();
const parserCryptoUseCase = new ParserCryptoUseCase(cryptoRepository);
const parserCryptoController = new ParserCryptoController(parserCryptoUseCase);

export { parserCryptoController };
