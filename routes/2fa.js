import express from 'express';
import { twofaController } from '../controller/2faController.js';

const router = express.Router();

router
    .route('/')
    .get(twofaController)

export default router;