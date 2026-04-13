import express from 'express';
const router = express.Router();

import {
    logData,
    getLogs
} from '../../controllers/data_controllers/data_controllers.js';

router.post('/logData', logData);
router.get('/logs', getLogs);

export default router;
