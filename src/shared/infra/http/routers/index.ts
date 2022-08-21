import { Router } from 'express';

import { cryptoSheetsRouter } from './cryptoSheets.routes';
import { indexRoutes } from './indexFrontEnd.routes';
import { accountRouter } from './accounts.routes';

const router = Router();

router.use(indexRoutes);
router.use('/cryptocoin', cryptoSheetsRouter);
router.use('/account', accountRouter);

export { router };