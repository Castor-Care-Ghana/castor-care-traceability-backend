import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

// Helper function to generate unique package codes
function generatePackageCode(batchId) {
  return `PKG-${batchId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

const packageSchema = new Schema(
  {
    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 1,
    },
    packageCode: {
      type: String,
      unique: true,
    },
    qrCode: {
      type: String, // can store a URL or base64 string for QR image
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // assuming you have a User model
      required: true,
    },
  },
  { timestamps: true }
);
packageSchema.plugin(toJSON);

// Auto-generate packageCode before save
packageSchema.pre("save", function (next) {
  if (!this.packageCode) {
    this.packageCode = generatePackageCode(this.batch.toString());
  }
  next();
});

export const PackageModel = model("Package", packageSchema);
