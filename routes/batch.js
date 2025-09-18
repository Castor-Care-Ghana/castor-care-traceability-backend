import { Router } from "express";
import { createBatch, deleteBatch, getBatch, getBatches, updateBatch } from "../controllers/batch.js";
import { isAuthenticated } from "../middlewares/authenticator.js";

const batchRouter = Router();

batchRouter.post('/batches', isAuthenticated, createBatch);
batchRouter.get('/batches', isAuthenticated, getBatches);
batchRouter.get('/batches/:id', isAuthenticated, getBatch);
batchRouter.patch('/batches/:id', isAuthenticated, updateBatch);
batchRouter.delete('/batches/:id', isAuthenticated, deleteBatch);

export default batchRouter;