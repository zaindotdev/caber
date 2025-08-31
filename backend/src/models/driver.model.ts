import mongoose, { Schema } from "mongoose";

interface IDriver {
  username: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  otp: number;
  otp_expiry: Date;
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
    otp: {
      type: Number,
      required: true,
    },
    otp_expiry: {
      type: Date,
      required: true,
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
