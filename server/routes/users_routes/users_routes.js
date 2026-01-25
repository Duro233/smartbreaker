import express from 'express';
const router = express.Router();

import { 
    createUser,
    deleteUser,
    loginUser} from '../../controllers/users_controllers/users_controllers.js';

router.post('/create_user', createUser);
router.post('/loginUser', loginUser);


router.post('/delete_user', deleteUser);

export default router;
