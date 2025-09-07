import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";
import { Driver } from "../models/driver.model";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const driver = await Driver.findById((decoded as JwtPayload).id);
    if (!driver) {
      return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
    }
    req.driver = driver;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
  }
};
