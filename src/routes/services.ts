import express from 'express'
import { serviceController } from '../controllers/serviceController';

const router = express.Router();

router.post('/add-service', serviceController.addServices);
router.post('/add-operating-hours', serviceController.addWorkdays);
router.get('/list-services', serviceController.listServices);
router.get('/get-workdays', serviceController.getWorkdays);

export default router;