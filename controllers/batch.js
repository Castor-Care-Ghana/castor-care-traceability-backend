import { BatchModel } from "../models/batch.js";
import { createBatchValidator, updateBatchValidator } from "../validators/batch.js";

// Create batch
export const createBatch = async (req, res, next) => {
  try {
    const { error, value } = createBatchValidator.validate(req.body);

    if (error) {
      return res.status(422).json(error);
    }

    const batch = await BatchModel.create({
      ...value,
      user: req.auth.id, // only if you want direct ownership
    });

    res.status(201).json({ message: "Batch created successfully", batch });
  } catch (err) {
    next(err);
  }
};

// Get all batches
export const getBatches = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}", limit = 10000, skip = 0 } = req.query;

    const batches = await BatchModel.find(JSON.parse(filter))
      .sort(JSON.parse(sort))
      .limit(Number(limit))
      .skip(Number(skip))
      .populate("farmer")
      .populate("user" , "-password");

    res.status(200).json(batches);
  } catch (err) {
    next(err);
  }
};

// Get single batch
export const getBatch = async (req, res, next) => {
  try {
    const batch = await BatchModel.findById(req.params.id).populate("farmer").populate("user", "-password");

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({ message: "Batch retrieved", batch });
  } catch (err) {
    next(err);
  }
};

// Update batch
export const updateBatch = async (req, res, next) => {
  try {
    const { error, value } = updateBatchValidator.validate(req.body);
    if (error) return res.status(422).json(error);  
    const batch = await BatchModel.findById(req.params.id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    const isAdmin = req.auth?.role?.toLowerCase() === "admin";
    if (!isAdmin && String(batch.user) !== String(req.auth.id)) {
      return res.status(403).json({ message: "Not authorized to update this batch" });
    }

    Object.assign(batch, req.body);
    const updated = await batch.save();
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteBatch = async (req, res, next) => {
  try {
    const batch = await BatchModel.findById(req.params.id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    const isAdmin = req.auth?.role?.toLowerCase() === "admin";
    if (!isAdmin && String(batch.user) !== String(req.auth.id)) {
      return res.status(403).json({ message: "Not authorized to delete this batch" });
    }

    await batch.deleteOne();
    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (err) {
    next(err);
  }
};

