import mongoose, { Schema } from "mongoose";

interface IVehicle {
  model: string;
  registrationNumber: string;
  driver: mongoose.Types.ObjectId;
  type: "Car" | "Bike" | "Rikshaw";
}

const vehicleSchema = new Schema<IVehicle>(
  {
    model: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    driver: { type: Schema.Types.ObjectId, ref: "driver", required: true },
    type: { type: String, required: true, enum: ["Car", "Bike", "Rikshaw"] },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model<IVehicle>("vehicle", vehicleSchema);
