import mongoose, { Schema } from "mongoose";

interface IDriver {
  username: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  otp: number | null;
  otp_expiry: Date | null;
  vehicle: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  isVerified: boolean;
}

const driverSchema = new Schema<IDriver>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password:{
      type: String,
      required: true
    },
    otp: {
      type: Number,
    },
    otp_expiry: {
      type: Date,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "vehicle",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Driver = mongoose.model<IDriver>("driver", driverSchema);
