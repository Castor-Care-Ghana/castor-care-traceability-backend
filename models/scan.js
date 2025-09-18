import { Schema, model } from "mongoose";

const ScanSchema = new Schema(
  {
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    scannedBy: {
      type: String, // farmer, consumer, distributor, retailer, castor staff etc.
      required: true,
    },
    location: {
      type: String, // GhanaPost GPS where scan happened
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // some scans may be anonymous (consumers)
    },
  },
  { timestamps: true }
);

export const ScanModel = model("Scan", ScanSchema);
