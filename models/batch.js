import { Schema, model } from "mongoose";
import axios from "axios";
import { toJSON } from "@reis/mongoose-to-json";
/**
 * Fetch GhanaPost GPS Address using official API
 */
async function fetchGhanaPostGps(lat, lng) {
  try {
    const url = process.env.GPGPS_apiURL;

    const payload = {
      Request: "generate_address",
      Language: process.env.GPGPS_languageCode || "en",
      Country: process.env.GPGPS_country || "GH",
      Latitude: lat.toString(),
      Longitude: lng.toString(),
      AndroidKey: process.env.GPGPS_deviceId,
      AndroidCert: process.env.GPGPS_androidCert,
      AndroidPackage: process.env.GPGPS_androidPackage,
    };

    const headers = {
      Authorization: process.env.GPGPS_authorization,
      "Content-Type": "application/json",
      AsaaseUser: process.env.GPGPS_asaaseUser,
    };

    const { data } = await axios.post(url, payload, { headers });

    if (data?.Digital_Address) {
      // Example: GA-492-8374
      return data.Digital_Address;
    } else if (data?.gps_name) {
      // Fallback field name from other endpoints
      return data.gps_name;
    } else {
      console.warn("⚠️ GhanaPostGPS returned no valid address:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching GhanaPostGPS address:", error.message);
    return null;
  }
}

/**
 * Fallback GPS Code generator (if API fails)
 */
function fallbackGpsCode(lat, lng) {
  const prefix = "GA";
  const part1 = Math.abs(Math.floor(lat * 1000)) % 1000;
  const part2 = Math.abs(Math.floor(lng * 10000)) % 10000;
  return `${prefix}-${part1.toString().padStart(3, "0")}-${part2
    .toString()
    .padStart(4, "0")}`;
}

/**
 * Batch Schema
 */
const batchSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },
    cropType: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    collectionLocation: { type: String, required: true, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    gpsAddress: { type: String },
    batchCode: { type: String, unique: true },
  },
  { timestamps: true }
);

/**
 * Pre-save hook:
 * - Auto generate GPS address from GhanaPost API
 * - Generate unique batch code
 */
batchSchema.pre("save", async function (next) {
  try {
    if (!this.gpsAddress && this.latitude && this.longitude) {
      const gps = await fetchGhanaPostGps(this.latitude, this.longitude);
      this.gpsAddress = gps || fallbackGpsCode(this.latitude, this.longitude);
    }

    if (!this.batchCode) {
      this.batchCode = `BATCH-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
    }

    next();
  } catch (err) {
    next(err);
  }
});

batchSchema.plugin(toJSON);
export const BatchModel = model("Batch", batchSchema);
