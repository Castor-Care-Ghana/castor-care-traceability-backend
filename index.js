import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/user.js';
import farmerRouter from './routes/farmer.js';
import batchRouter from './routes/batch.js';
import packageRouter from './routes/package.js';
import scanRouter from './routes/scan.js';
import { connectRabbitMQ } from "./utils/rabbitmq.js";

connectRabbitMQ();

await mongoose.connect(process.env.MONGO_URI)
const app = express();

app.use(cors())
app.use(express.json());



app.use(userRouter);
app.use(farmerRouter);
app.use(batchRouter);
app.use(packageRouter);
app.use(scanRouter);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});