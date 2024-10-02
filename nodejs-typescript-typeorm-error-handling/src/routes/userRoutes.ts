// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUser, createUser, updateUser, deleteUser } from '../controllers/userController';
import { validationMiddleware } from '../middlewares/validate';
import { User } from '../entities/User';

const router = Router();

router.get('/:id', getUser);
router.post('/', validationMiddleware(User), createUser);
router.put('/:id', validationMiddleware(User), updateUser);
router.delete('/:id', deleteUser);

export default router;
