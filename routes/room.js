import express from "express";
import { roomController } from "../controller/roomController.js";

const router = express.Router();

router
    .route('/')
    .post(roomController)
    

export default router;