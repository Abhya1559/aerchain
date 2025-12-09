import express from "express";
import { rfpAgent } from "../controller/rfp.controller.js";

const router = express.Router();

router.post("/rfp", rfpAgent);

export default router;
