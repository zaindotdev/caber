import { HttpResponse } from "../utils/httpResponse";
import { Vehicle } from "../models/vehicle.model";
import type { Request, Response } from "express";

export const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await Vehicle.find().populate("driver");
        return res.status(200).json(HttpResponse.ok({
            message:"Vehicles info fetched successfully",
            vehicles
        }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(HttpResponse.serverError(error));
    }
};

export const getVehicleById = async (req: Request, res: Response) => {
    try {
        if(!req.params.id){
            return res.status(400).json(HttpResponse.badRequest("Vehicle id is required"));
        }

        if(!req.driver){
            return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
        }
        const vehicle = await Vehicle.findById(req.params.id).populate("driver");
        return res.status(200).json(HttpResponse.ok({
            message:"Vehicle info fetched successfully",
            vehicle
        }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(HttpResponse.serverError(error));
    }
};

export const addVehicle = async (req: Request, res: Response) => {
    try {
        if(!req.driver){
            return res.status(401).json(HttpResponse.unauthorized("Unauthorized"));
        }

        const {model, registrationNumber, type} = req.body;
    
        if(!model || !registrationNumber || !type){
            return res.status(400).json(HttpResponse.badRequest("All fields are required"));
        }
        const vehicle = await Vehicle.create({
            model,
            registrationNumber,
            type,
            driver: req.driver._id
        });
        return res.status(200).json(HttpResponse.ok(vehicle));
    } catch (error) {
        console.error(error);
        return res.status(500).json(HttpResponse.serverError(error));
    }
};