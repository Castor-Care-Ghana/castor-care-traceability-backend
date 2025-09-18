import { Router } from "express";
import { getProfile, getAllProfile, logInUser, logOutUser, registerUser, updateProfile, forgotPassword, resetPassword, getUserFarmers } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/authenticator.js";
import { userAvatarUpload } from "../middlewares/uploads.js";

const userRouter = Router();

userRouter.post('/users/register', registerUser);

userRouter.post('/users/login', logInUser);

userRouter.get('/users/me', isAuthenticated, getProfile);

userRouter.get('/users/:id', isAuthenticated, getProfile);

userRouter.get('/users', isAuthenticated, getAllProfile);

userRouter.post('/users/logout', isAuthenticated, logOutUser);



userRouter.patch('/users/me', isAuthenticated, userAvatarUpload.single('avatar'), updateProfile);

userRouter.post('/users/forgot-password', forgotPassword);

userRouter.post('/users/reset-password/:token', resetPassword);

userRouter.get('/users/me/farmers', isAuthenticated, getUserFarmers);


export default userRouter;