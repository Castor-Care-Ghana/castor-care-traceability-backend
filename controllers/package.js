import { PackageModel } from "../models/package.js";
import {
  createPackageValidator,
  updatePackageValidator,
} from "../validators/package.js";
import QRCode from "qrcode";

// ✅ Create Package
export const createPackage = async (req, res, next) => {
  try {
    const { error, value } = createPackageValidator.validate(req.body);

    if (error) {
      return res.status(422).json(error);
    }

    // Step 1: Create package document
     const pkg = new PackageModel({
      ...value,
      user: req.auth.id,
    });
    await pkg.save();

    // Step 2: Generate QR Code (stores a tracking URL or packageCode)
    const qrData = `https://traceability-app.com/package/${pkg._id}`;
    // const qrImage = await QRCode.toDataURL(qrData);

    // Step 3: Save QR code in DB
    // pkg.qrCode = qrImage;
    pkg.qrCode = qrData; // or store the image if preferred
    await pkg.save();

    res.status(201).json({
      message: "Package created successfully",
      data: pkg,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Get all Packages
export const getPackages = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}", limit = 10000, skip = 0 } = req.query;

    const packages = await PackageModel.find(JSON.parse(filter))
      .sort(JSON.parse(sort))
      .limit(Number(limit))
      .skip(Number(skip))
      .populate("user")
      .populate("batch");

    res.status(200).json(packages);
  } catch (err) {
    next(err);
  }
};

// ✅ Get single Package by ID
export const getPackage = async (req, res, next) => {
  try {
    const pkg = await PackageModel.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json(pkg);
  } catch (err) {
    next(err);
  }
};

// ✅ Update Package
export const updatePackage = async (req, res, next) => {
  try {
    const { error, value } = updatePackageValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    const query =
      req.auth.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, user: req.auth.id };

    const updatePackage = await PackageModel.findOneAndUpdate(query, value, {
      new: true,
    });

    if (!updatePackage) {
      return res.status(404).json("Package not found or not authorized");
    }

    res.status(200).json(updatePackage);
  } catch (error) {
    next(error);
  }
};

export const deletePackage = async (req, res, next) => {
  try {
    const query =
      req.auth.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, user: req.auth.id };

    const pkg = await PackageModel.findOneAndDelete(query);
    if (!pkg) {
      return res
        .status(404)
        .json({ message: "Package not found or not authorized" });
    }

    res.status(200).json({ message: "Package deleted successfully", pkg });
  } catch (error) {
    next(error);
  }
};
