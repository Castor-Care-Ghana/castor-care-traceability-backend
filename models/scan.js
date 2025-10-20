import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const ScanSchema = new Schema(
  {
    package: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    scannedBy: { type: String, required: true, default: "Anonymous (guest)" },
    location: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["available", "sold", "in-transit"],
      default: "available",
    },
    history: [
      {
        at: { type: Date, default: Date.now },
        by: { type: Schema.Types.ObjectId, ref: "User" },
        byLabel: { type: String },
        oldStatus: { type: String },
        oldLocation: { type: String },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

ScanSchema.plugin(toJSON);

// 🧠 Automatically assign scannedBy label based on user info
ScanSchema.pre("save", async function (next) {
  try {
    if (this.user) {
      const { UserModel } = await import("./user.js");
      const user = await UserModel.findById(this.user).select(
        "fullName userName name role"
      );

      if (user) {
        const name = user.fullName || user.userName || user.name || "Unnamed";
        const role = user.role?.toLowerCase() || "user";
        this.scannedBy = `${name} (${role})`;
      } else {
        this.scannedBy = "Anonymous (guest)";
      }
    } else {
      this.scannedBy = "Anonymous (guest)";
    }
  } catch (err) {
    console.error("❌ Error setting scannedBy:", err.message);
    this.scannedBy = "Anonymous (guest)";
  }
  next();
});

export const ScanModel = model("Scan", ScanSchema);
