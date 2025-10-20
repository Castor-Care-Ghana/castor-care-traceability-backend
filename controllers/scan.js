import { ScanModel } from "../models/scan.js";
import { PackageModel } from "../models/package.js";
import {
  createScanValidator,
  updateScanValidator,
} from "../validators/scan.js";

export const createScan = async (req, res, next) => {
  try {
    console.log("🧩 AUTH:", req.auth); // Debug
    const { package: packageId, location, status } = req.body;

    const pkg = await PackageModel.findById(packageId);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const scan = await ScanModel.create({
      package: packageId,
      location,
      status,
      user: req.auth?.id || req.auth?._id || null,
    });

    res.status(201).json({
      message: "Scan recorded successfully",
      scan,
    });
  } catch (error) {
    console.error("❌ createScan error:", error.message);
    res.status(500).json({ message: "Failed to record scan" });
  }
};

export const getScans = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}", limit = 10000, skip = 0 } = req.query;

    const scans = await ScanModel.find(JSON.parse(filter))
      .populate("package")
      .populate("user", "-password")
      .sort(JSON.parse(sort))
      .limit(Number(limit))
      .skip(Number(skip));

    res.status(200).json(scans);
  } catch (error) {
    next(error);
  }
};

export const getScan = async (req, res, next) => {
  try {
    const scan = await ScanModel.findById(req.params.id)
      .populate("package")
      .populate("user", "-password");

    if (!scan) return res.status(404).json({ message: "Scan not found" });

    res.status(200).json(scan);
  } catch (error) {
    next(error);
  }
};


export const updateScan = async (req, res, next) => {
  try {
    const { error, value } = updateScanValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    const scan = await ScanModel.findById(req.params.id).populate("package");
    if (!scan) return res.status(404).json({ message: "Scan not found" });

    const isAdmin = req.auth?.role?.toLowerCase() === "admin";
    if (!isAdmin && String(scan.user) !== String(req.auth.id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this scan" });
    }

    // ✅ Allow updates to location or scannedBy (fixes)
    if (value.location) scan.location = value.location;
    if (value.scannedBy) scan.scannedBy = value.scannedBy;

    // ✅ Handle status update (admin or owner only)
    if (value.status) {
      const pkg = await PackageModel.findById(scan.package);
      if (pkg) {
        pkg.status = value.status;
        await pkg.save();
      }
      scan.status = value.status;
    }

    const updated = await scan.save();

    res.status(200).json({
      message: "Scan updated successfully",
      scan: updated,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteScan = async (req, res, next) => {
  try {
    const scan = await ScanModel.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: "Scan not found" });

    const isAdmin = req.auth?.role?.toLowerCase() === "admin";
    if (!isAdmin && String(scan.user) !== String(req.auth.id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this scan" });
    }

    await scan.deleteOne();
    res.status(200).json({ message: "Scan deleted successfully" });
  } catch (error) {
    next(error);
  }
};
