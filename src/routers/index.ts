import { Router } from 'express';

import { cryptoSheetsRouter } from './cryptoSheets';
import { indexRoutes } from './indexFrontEnd';
import { accountRouter } from './accounts';

const router = Router();

router.use(cryptoSheetsRouter);
router.use(indexRoutes);
router.use(accountRouter);

export { router };