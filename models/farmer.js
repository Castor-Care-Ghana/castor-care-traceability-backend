import { Schema, model} from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const farmerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      
    },
    lastName: {
      type: String,
      
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    phone: {
      type: String,
    },

    email: {
      type: String
    },
    idNumber: {
      type: String,
    },
    address: {
      type: String, // descriptive physical address
    },
    gpsAddress: {
      type: String, // e.g. "GA-123-4567"
    //   match: /^[A-Z]{2}-\d{3,4}-\d{4}$/, // simple validation for GhanaPost format
    },
    farmSize: {
      type: String, // e.g. "5 acres"
    },
    cropType: {
      type: String, // e.g. "Maize, Cocoa"
    },
    image: {
      type: String, // URL or path to image
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },

    user: { type: Schema.Types.ObjectId, ref: 'User', required: true}
  },
  { timestamps: true }
);

farmerSchema.plugin(toJSON);

export const FarmerModel = model("Farmer", farmerSchema);
