import express from 'express'
import { scheduleController } from '../controllers/scheduleController';

const router = express.Router();

router.get('/get-availableDatas', scheduleController.getAvailableSchedule);
router.post('/schedule/:cellNumber', scheduleController.addSchedule);
router.get('/get-clientSchedule/:cellNumber', scheduleController.getClientSchedule);
router.get('/get-Schedule', scheduleController.getDaySchedule);

export default router;