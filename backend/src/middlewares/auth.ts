import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById((decoded as JwtPayload).id);
    if (!user) {
      return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
  }
};
