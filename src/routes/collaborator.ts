import express from 'express'
import { collaboratorController } from '../controllers/collaboratorsController';

const router = express.Router();

router.post('/add-collaborator', collaboratorController.addCollaborator);
router.get('/get-collaborator/:id', collaboratorController.getCollaborator);
router.get('/get-collaborators', collaboratorController.getCollaboratorList);

export default router;