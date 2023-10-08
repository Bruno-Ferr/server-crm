import express from 'express'
import { collaboratorController } from '../controllers/collaboratorsController';

const router = express.Router();

router.post('/add-collaborator', collaboratorController.addCollaborator);
router.get('/get-collaborator/:id', collaboratorController.getCollaborator);

export default router;