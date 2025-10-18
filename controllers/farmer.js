import {FarmerModel} from '../models/farmer.js';
import { registerFarmerValidator, updateFarmerValidator } from '../validators/farmer.js';

export const registerFarmer = async (req, res, next) => {
   try {
     const {error, value} = registerFarmerValidator.validate({
         ...req.body,
         image: req.file?.path
     });
     if (error) {
         return res.status(422).json(error);
     } 
        const farmer = await FarmerModel.create({
            ...value,
            user: req.auth.id
        });
        res.status(201).json({
            message: 'Farmer registered successfully',
            farmer
        });
   } catch (error) {
        next(error); 
   }  
}

export const getFarmers = async (req, res, next) => {
    try {
        const { filter = "{}", sort = "{}", limit = 10000, skip = 0 } = req.query;
        const farmers = await FarmerModel
        .find(JSON.parse(filter))
        .sort(JSON.parse(sort))
        .limit(limit)
        .skip(skip)
        .populate("user", "-password");
        res.status(200).json(farmers);
    } catch (error) {
        next(error);
    }
}

export const getFarmer = async(req,res, next) => {
    try {
        const farmer =await FarmerModel.findById(req.params.id).populate("user", "-password");
        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found" });
        }
        res.status(200).json(farmer);
    } catch (error) {
        next(error);
        
    }
}

export const updateFarmer = async (req, res, next) => {
  try {
    const { error, value } = updateFarmerValidator.validate(req.body);
    if (error) return res.status(422).json(error);
    const farmer = await FarmerModel.findById(req.params.id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    const isAdmin = req.auth?.role?.toLowerCase() === "admin";
    if (!isAdmin && String(farmer.user) !== String(req.auth.id)) {
      return res.status(403).json({ message: "Not authorized to update this farmer" });
    }

    Object.assign(farmer, req.body);
    const updated = await farmer.save();
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteFarmer = async (req, res, next) => {
  try {
    const farmer = await FarmerModel.findById(req.params.id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    const isAdmin = req.auth?.role?.toLowerCase() === "admin";
    if (!isAdmin && String(farmer.user) !== String(req.auth.id)) {
      return res.status(403).json({ message: "Not authorized to delete this farmer" });
    }

    await farmer.deleteOne();
    res.status(200).json({ message: "Farmer deleted successfully" });
  } catch (error) {
    next(error);
  }
};
