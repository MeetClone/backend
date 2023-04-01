import express from 'express';
import { logoutController } from '../controller/logoutController.js';
const router = express.Router();

router
    .route('/')
    .get(logoutController)

export default router;