import { Router } from "express";
import { createPackage, deletePackage, getPackage, getPackages, updatePackage } from "../controllers/package.js";
import { isAuthenticated } from "../middlewares/authenticator.js";

const packageRouter = Router();

packageRouter.post("/packages", isAuthenticated, createPackage);
packageRouter.get("/packages", isAuthenticated, getPackages);
packageRouter.get("/packages/:id", isAuthenticated, getPackage);
packageRouter.patch("/packages/:id", isAuthenticated, updatePackage);
packageRouter.delete("/packages/:id", isAuthenticated, deletePackage);

export default packageRouter;
