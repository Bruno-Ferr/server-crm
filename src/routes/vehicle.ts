import express from 'express'
import { vehicleController } from '../controllers/vehicleController';

const router = express.Router();

router.post('/add-vehicle/:cellNumber', vehicleController.addVehicle);
router.get('/get-client-vehicles/:cellNumber', vehicleController.getClientVehicles);

export default router;