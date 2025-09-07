import { HttpResponse } from "../utils/httpResponse";
import { sendMail } from "../utils/sendMail";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Driver } from "../models/driver.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { email,password, username, firstName, lastName } = req.body;

    if (!email || !password || !username || !firstName || !lastName) {
      return res
        .status(400)
        .json(HttpResponse.badRequest("All fields are required"));
    }

    const existedDriver = await Driver.findOne({ email });
    if (existedDriver) {
      return res
        .status(400)
        .json(HttpResponse.badRequest("User already exists"));
    }

    const otp = crypto.randomInt(100000, 999999);
    const otp_expiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      username,
      fullName: {
        firstName,
        lastName,
      },
      email,
      password: hashedPassword,
      otp,
      otp_expiry,
      vehicle: null,
      isVerified: false,
    });

    if (!driver) {
      return res
        .status(500)
        .json(HttpResponse.serverError("Something went wrong"));
    }

    await sendMail({
      email,
      otp,
      otp_expiry,
    });

    const storedDriver = await Driver.findById(driver._id).select("-password -otp -otp_expiry");
    if (!storedDriver) {
      return res
        .status(500)
        .json(HttpResponse.serverError("Something went wrong"));
    }

    return res
      .status(200)
      .json(HttpResponse.ok({message:"Driver registered successfully",driver: storedDriver}));
  } catch (error) {
    console.error(error);
    return res.status(500).json(HttpResponse.serverError(error));
  }
};

export const verifyOTP = async(req:Request, res:Response)=>{
    try {
        const {otp} = req.body;
        const {id} = req.query;

        const driver = await Driver.findById(id);

        if(!driver){
            return res.status(400).json(HttpResponse.badRequest("Driver not found"));
        }
        
        if(driver.isVerified){
            return res.status(400).json(HttpResponse.badRequest("Driver already verified"));
        }
        
        if(driver.otp_expiry && driver.otp_expiry < new Date()){
            return res.status(400).json(HttpResponse.badRequest("OTP expired"));
        }

        if(driver.otp !== Number(otp)){
            return res.status(400).json(HttpResponse.badRequest("Invalid OTP"));
        }

        driver.isVerified = true;
        driver.otp = null;
        driver.otp_expiry = null;
        await driver.save();

        return res.status(200).json(HttpResponse.ok("Driver verified successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(HttpResponse.serverError(error));
    }
}

export const driverSignIn = async(req:Request, res:Response)=>{
    try {
        const {email, password} = req.body;

        if(!email){
            return res.status(400).json(HttpResponse.badRequest("Email is required"));
        }

        const driver = await Driver.findOne({email});

        if(!driver){
            return res.status(400).json(HttpResponse.badRequest("Driver not found"));
        }

        const isPasswordMatch = await bcrypt.compare(password, driver.password);
        if(!isPasswordMatch){
            return res.status(400).json(HttpResponse.badRequest("Invalid password"));
        }

        if(!driver.isVerified){
            return res.status(400).json(HttpResponse.badRequest("Driver not verified"));
        }

        const token = jwt.sign({id: driver._id}, process.env.JWT_SECRET!, {
            expiresIn: "1d"
        });

        if(!token){
            return res.status(500).json(HttpResponse.serverError("Something went wrong"));
        }

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
            })
            .json(HttpResponse.ok({
                message:"Driver signed in successfully",
                token
            }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(HttpResponse.serverError(error));
    }
}

export const driverSignOut = async(req:Request, res:Response)=>{
    try {
        if(!req.driver){
            return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
        }
        return res
            .status(200)
            .clearCookie("token")
            .json(HttpResponse.ok("Driver signed out successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(HttpResponse.serverError(error));
    }
}

export const getDriversInfo = async(req:Request, res:Response)=>{
    try {
        if(!req.driver){
            return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
        }

        const driver = await Driver.findById(req.driver._id).select("-otp -otp_expiry -password");

        return res.status(200).json(HttpResponse.ok({
            message:"Driver info fetched successfully",
            driver
        }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(HttpResponse.serverError(error));
    }
}

