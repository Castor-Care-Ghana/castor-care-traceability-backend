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
        const { filter = "{}", sort = "{}", limit = 10, skip = 0 } = req.query;
        const farmers = await FarmerModel
        .find(JSON.parse(filter))
        .sort(JSON.parse(sort))
        .limit(limit)
        .skip(skip)
        .populate("user");
        res.status(200).json(farmers);
    } catch (error) {
        next(error);
    }
}

export const getFarmer = async(req,res, next) => {
    try {
        const farmer =await FarmerModel.findById(req.params.id);
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
        const { error, value } = updateFarmerValidator.validate({
            ...req.body,
            image: req.file?.path
        });
        if (error) {
            return res.status(422).json(error);
        }
        const updateFarmer = await FarmerModel.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.auth.id
            },
            value,
            { new: true }
        );
        if (!updateFarmer) {
            res.status(404).json("Farmer not found");
        }
            res.status(200).json(updateFarmer)


    } catch (error) {
        next(error)
    }
};


export const deleteFarmer = async (req, res, next) => {
    try {
        const farmer = await FarmerModel.findOneAndDelete({
            _id: req.params.id,
            user: req.auth.id
        });
        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found or not authorized" });
        }
        res.status(200).json({ message: "Farmer deleted successfully",  farmer });
    } catch (err) {
        next(err);
    }
};