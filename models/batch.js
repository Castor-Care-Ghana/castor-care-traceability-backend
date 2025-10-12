import { Schema, model } from "mongoose";
import axios from "axios";

// GhanaPostGPS API fetcher
async function fetchGhanaPostGps(lat, lng) {
  try {
    // Replace this URL with the actual GhanaPost GPS API endpoint
    const url = `https://gps.sourcecodegh.com/v1/trial/${lat}/${lng}`;
    const { data } = await axios.get(url, { headers: { Accept: "application/json" } });
    if (data?.gps_name) return data.gps_name; // e.g. "GA-236-177"
    return null;
  } catch (error) {
    console.error("Error fetching GhanaPost GPS:", error.message);
    return null;
  }
}

// Fallback generator if API fails
function fallbackGpsCode(lat, lng) {
  const prefix = "GA";
  const part1 = Math.abs(Math.floor(lat * 1000)) % 1000;
  const part2 = Math.abs(Math.floor(lng * 10000)) % 10000;
  return `${prefix}-${part1.toString().padStart(3, "0")}-${part2
    .toString()
    .padStart(4, "0")}`;
}

const batchSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },
    cropType: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    collectionLocation: { type: String, required: true, trim: true }, // user input only
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    gpsAddress: { type: String },
    batchCode: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate gpsAddress + batchCode
batchSchema.pre("save", async function (next) {
  try {
    if (!this.gpsAddress && this.latitude && this.longitude) {
      const gps = await fetchGhanaPostGps(this.latitude, this.longitude);
      this.gpsAddress = gps || fallbackGpsCode(this.latitude, this.longitude);
    }
    if (!this.batchCode) {
      this.batchCode = `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const BatchModel = model("Batch", batchSchema);
