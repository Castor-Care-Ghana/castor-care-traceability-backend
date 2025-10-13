import { ScanModel } from "../models/scan.js";
import { PackageModel } from "../models/package.js";
import {
  createScanValidator,
  updateScanValidator,
} from "../validators/scan.js";

export const createScan = async (req, res, next) => {
  try {
    const { error, value } = createScanValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    // Ensure package exists
    const pkg = await PackageModel.findById(value.package);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Attach user if authenticated
    if (req.auth?.id) {
      value.user = req.auth.id;
    }

    const scan = await ScanModel.create(value);

    res.status(201).json({
      message: "Scan recorded successfully", scan
    });
  } catch (err) {
    next(err);
  }
};


export const getScans = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}", limit = 10, skip = 0 } = req.query;

    const scans = await ScanModel.find(JSON.parse(filter))
      .populate("package")
      .populate("user")
      .sort(JSON.parse(sort))
      .limit(Number(limit))
      .skip(Number(skip));

    res.status(200).json(scans);
  } catch (err) {
    next(err);
  }
};

export const getScan = async (req, res, next) => {
  try {
    const scan = await ScanModel.findById(req.params.id)
      .populate("package")
      .populate("user");
    if (!scan) return res.status(404).json({ message: "Scan not found" });

    res.status(200).json(scan);
  } catch (err) {
    next(err);
  }
};

export const updateScan = async (req, res, next) => {
  try {
    const { error, value } = updateScanValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    const updatedScan = await ScanModel.findOneAndUpdate(
      { _id: req.params.id },
      value,
      { new: true }
    );

    if (!updatedScan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    res.status(200).json({
      message: "Scan updated successfully",
      data: updatedScan,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteScan = async (req, res, next) => {
  try {
    const deletedScan = await ScanModel.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedScan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    res.status(200).json({
      message: "Scan deleted successfully", deletedScan,
    });
  } catch (err) {
    next(err);
  }
};
