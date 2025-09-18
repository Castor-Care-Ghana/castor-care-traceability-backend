// import { Schema, model, Types} from "mongoose";
// import { toJSON } from "@reis/mongoose-to-json";

// // GhanaPost GPS generator (pseudo until API is available)
// function generateGpsCode(lat, lng) {
//   const prefix = "GA"; // for Greater Accra, can extend to other regions later
//   const part1 = Math.abs(Math.floor(lat * 1000)) % 1000;   // 3 digits
//   const part2 = Math.abs(Math.floor(lng * 10000)) % 10000; // 4 digits
//   return `${prefix}-${part1.toString().padStart(3, "0")}-${part2
//     .toString()
//     .padStart(4, "0")}`;
// }

// const batchSchema = new Schema(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     farmer: {
//       type: Schema.Types.ObjectId,
//       ref: "Farmer",
//       required: true,
//     },
//     cropType: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
//     gpsAddress: {
//       type: String,
//     },
//     collectionLocation: {
//         type: String,
//         reqquired: true,
//     },
//     batchCode: {
//       type: String,
//       unique: true,
//     },
//   },
//   { timestamps: true }
// );

// batchSchema.plugin(toJSON);

// // Pre-save hook to auto-generate GPS + BatchCode
// batchSchema.pre("save", function (next) {
//   if (!this.gpsAddress && this.collectionLocation) {
//     this.gpsAddress = generateGpsCode(
//       this.collectionLocation.lat,
//       this.collectionLocation.lng
//     );
//   }

//   if (!this.batchCode) {
//     this.batchCode = `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//   }

//   next();
// });

// export const BatchModel = model("Batch", batchSchema);


import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

// GhanaPost GPS generator (from lat/lng)
function generateGpsFromCoords(lat, lng) {
  const prefix = "GA"; // Extend later for other regions
  const part1 = Math.abs(Math.floor(lat * 1000)) % 1000;   // 3 digits
  const part2 = Math.abs(Math.floor(lng * 10000)) % 10000; // 4 digits
  return `${prefix}-${part1.toString().padStart(3, "0")}-${part2
    .toString()
    .padStart(4, "0")}`;
}

// Fallback GPS generator (hash from address string)
function generateGpsFromAddress(address) {
  const prefix = "GA";
  const hash = [...address].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const part1 = (hash % 1000).toString().padStart(3, "0");
  const part2 = (hash % 10000).toString().padStart(4, "0");
  return `${prefix}-${part1}-${part2}`;
}

const batchSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },
    cropType: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    collectionLocation: { type: String, required: true, trim: true },
    latitude: { type: Number },   // optional
    longitude: { type: Number },  // optional
    gpsAddress: { type: String },
    batchCode: { type: String, unique: true },
  },
  { timestamps: true }
);

batchSchema.plugin(toJSON);

// Auto-generate GPS + BatchCode before saving
batchSchema.pre("save", function (next) {
  if (!this.gpsAddress) {
    if (this.latitude && this.longitude) {
      this.gpsAddress = generateGpsFromCoords(this.latitude, this.longitude);
    } else if (this.collectionLocation) {
      this.gpsAddress = generateGpsFromAddress(this.collectionLocation);
    }
  }

  if (!this.batchCode) {
    this.batchCode = `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  next();
});

export const BatchModel = model("Batch", batchSchema);
