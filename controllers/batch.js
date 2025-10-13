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
    const { filter = "{}", sort = "{}", limit = 10, skip = 0 } = req.query;

    const batches = await BatchModel.find(JSON.parse(filter))
      .sort(JSON.parse(sort))
      .limit(Number(limit))
      .skip(Number(skip))
      .populate("farmer");

    res.status(200).json({ message: "Batches retrieved", batches });
  } catch (err) {
    next(err);
  }
};

// Get single batch
export const getBatch = async (req, res, next) => {
  try {
    const batch = await BatchModel.findById(req.params.id).populate("farmer");

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

    if (error) {
      return res.status(422).json(error);
    }

    const updatedBatch = await BatchModel.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.id }, // optional ownership check
      value,
      { new: true }
    );

    if (!updatedBatch) {
      return res
        .status(404)
        .json({ message: "Batch not found or not authorized" });
    }

    res
      .status(200)
      .json({ message: "Batch updated successfully", updatedBatch });
  } catch (err) {
    next(err);
  }
};

// Delete batch
export const deleteBatch = async (req, res, next) => {
  try {
    const deletedBatch = await BatchModel.findOneAndDelete({
      _id: req.params.id,
      user: req.auth.id,
    });

    if (!deletedBatch) {
      return res
        .status(404)
        .json({ message: "Batch not found or not authorized" });
    }

    res
      .status(200)
      .json({ message: "Batch deleted successfully", deletedBatch });
  } catch (err) {
    next(err);
  }
};
