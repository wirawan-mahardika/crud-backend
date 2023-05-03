import express from "express";
import dotenv from "dotenv";
import {
  adminAuth,
  adminVerification,
  refreshToken,
} from "../controllers/admin.controller.js";

dotenv.config();
const router = express.Router();

router.post("/", adminVerification);
router.get('/auth', adminAuth)
router.get("/refresh-token", refreshToken);


export default router;
