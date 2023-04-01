import express from 'express';
import { refreshTokenController } from '../controller/refreshTokenController.js';

const router = express.Router();

router
    .route('/')
    .get(refreshTokenController)

export default router;