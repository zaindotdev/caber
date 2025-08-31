import mongoose, { Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  otp: number | null;
  otp_expiry: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: Number,
    },
    otp_expiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("user", userSchema);
