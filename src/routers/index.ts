import { Router } from 'express';

import { cryptoSheetsRouter } from './cryptoSheets.routes';
import { indexRoutes } from './indexFrontEnd';
import { accountRouter } from './accounts.routes';

const router = Router();

router.use(cryptoSheetsRouter);
router.use(indexRoutes);
router.use('/account',accountRouter);

export { router };