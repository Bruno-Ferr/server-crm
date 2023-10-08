import express from 'express'
import { osController } from '../controllers/osController';

const router = express.Router();

router.post('/create-os/:scheduleId', osController.createOS);
router.get('/get-os/:schedule', osController.getOS);
router.put('/edit-os/:id', osController.updateOS);
router.post('/create-checklist', osController.createChecklist);

export default router;