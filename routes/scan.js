import {Router} from "express";
import { createScan, deleteScan, getScan, getScans, updateScan } from "../controllers/scan.js";
import { isAuthenticated } from "../middlewares/authenticator.js";  

const scanRouter = Router();

scanRouter.post('/scans', createScan);
scanRouter.get('/scans', isAuthenticated, getScans);
scanRouter.get('/scans/:id', isAuthenticated, getScan);
scanRouter.patch('/scans/:id', isAuthenticated, updateScan);
scanRouter.delete('/scans/:id', isAuthenticated, deleteScan);

export default scanRouter;