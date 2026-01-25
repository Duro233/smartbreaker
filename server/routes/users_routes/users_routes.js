import express from 'express';
const router = express.Router();

import { 
    createUser,
    deleteUser,
    loginUser,
    getUser} from '../../controllers/users_controllers/users_controllers.js';

router.post('/createUser', createUser);
router.post('/loginUser', loginUser);
router.get('/getUser', getUser);
router.post('/deleteUser', deleteUser);

export default router;
