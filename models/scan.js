import { Schema, model } from "mongoose";

const ScanSchema = new Schema(
  {
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    scannedBy: {
      type: String,
      required: true,
      default: "Anonymous (guest)",
    },
    location: {
      type: String, // GhanaPost GPS or coordinates
      trim: true,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Anonymous scans allowed
    },
    status: {
      type: String,
      enum: ["available", "sold", "in-transit"],
      default: "available",
      required: false,
    },
    history: [
      {
        at: { type: Date, default: Date.now },
        by: { type: Schema.Types.ObjectId, ref: "User", required: false },
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

ScanSchema.pre("save", async function (next) {
  if (this.isNew && this.user && (!this.scannedBy || this.scannedBy === "Anonymous")) {
    try {
      const { UserModel } = await import("./user.js");
      const user = await UserModel.findById(this.user).select("fullName role");

      if (user) {
        const role = user.role?.toLowerCase() || "user";
        const name = user.fullName || "Unnamed";
        this.scannedBy = `${name} (${role})`;
      }
    } catch (err) {
      console.error("Error assigning scannedBy:", err.message);
      this.scannedBy = "Anonymous";
    }
  } else if (!this.user && (!this.scannedBy || this.scannedBy === "Anonymous")) {
    this.scannedBy = "Anonymous (guest)";
  }

  next();
});

export const ScanModel = model("Scan", ScanSchema);
