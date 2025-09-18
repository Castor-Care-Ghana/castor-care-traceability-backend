import { Router } from 'express';
import { deleteFarmer, getFarmer, getFarmers, registerFarmer, updateFarmer } from '../controllers/farmer.js';
import { isAuthenticated } from '../middlewares/authenticator.js';
import { imageUpload } from '../middlewares/uploads.js';


const farmerRouter = Router();

farmerRouter.post ('/farmers', isAuthenticated,  imageUpload.single('image'), registerFarmer);
farmerRouter.get('/farmers', isAuthenticated, getFarmers);
farmerRouter.get('/farmers/:id', isAuthenticated, getFarmer);
farmerRouter.patch('/farmers/:id', isAuthenticated, imageUpload.single('image'), updateFarmer);
farmerRouter.delete('/farmers/:id', isAuthenticated, deleteFarmer);

export default farmerRouter;