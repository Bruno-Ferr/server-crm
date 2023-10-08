import express from 'express'
import { clientController } from '../controllers/clientController';

const router = express.Router();

router.post('/create-client', clientController.createClient);
router.get('/get-client/:cellNumber', clientController.getClient);
router.put('/edit-client/:cellNumber', clientController.editClient);

export default router;