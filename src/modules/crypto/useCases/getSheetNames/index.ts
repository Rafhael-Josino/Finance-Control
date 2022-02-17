import { GetSheetNamesUseCase } from './getSheetNamesUseCase';
import { GetSheetNamesController } from './getSheetNamesController';

const getSheetNamesUseCase = new GetSheetNamesUseCase();
const getSheetNamesController = new GetSheetNamesController(getSheetNamesUseCase);

export { getSheetNamesController };