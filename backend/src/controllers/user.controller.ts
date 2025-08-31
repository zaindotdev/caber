import { HttpResponse } from "../utils/httpResponse";
import { User } from "../models/user.model";
import { sendMail } from "../utils/sendMail";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(HttpResponse.badRequest("Email is required"));
    }

    let user = await User.findOne({ email });

    if (user?.otp_expiry && user.otp_expiry > new Date()) {
      const timeLeft = Math.ceil(
        (user.otp_expiry.getTime() - Date.now()) / 1000
      );
      return res
        .status(429)
        .json(
          HttpResponse.badRequest(
            `Please wait ${timeLeft} seconds before requesting a new OTP`
          )
        );
    }

    const otp = crypto.randomInt(100000, 999999);
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (!user) {
      user = await User.create({
        email,
        username: email.split("@")[0],
        otp,
        otp_expiry,
      });
    } else {
      user.otp = otp;
      user.otp_expiry = otp_expiry;
      await user.save();
    }

    // Send OTP email
    try {
      await sendMail({ email: user.email, otp, otp_expiry });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res
        .status(500)
        .json(HttpResponse.serverError("Failed to send verification email"));
    }

    return res
      .status(200)
      .json(HttpResponse.ok("Verification email sent successfully"));
  } catch (error) {
    console.error("Sign-in error:", error);
    return res
      .status(500)
      .json(HttpResponse.serverError("Internal server error"));
  }
};
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(HttpResponse.badRequest("User not found"));
    }

    if (user.otp !== Number(otp)) {
      return res.status(400).json(HttpResponse.badRequest("Invalid OTP"));
    }

    if (user.otp_expiry && user.otp_expiry < new Date()) {
      return res.status(400).json(HttpResponse.badRequest("OTP expired"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    user.isVerified = true;
    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json(HttpResponse.ok({ token, message: "Login successful" }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(HttpResponse.serverError(error));
  }
};

export const signOut = async (_req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .clearCookie("token")
      .json(HttpResponse.ok("Logout successful"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(HttpResponse.serverError(error));
  }
};
