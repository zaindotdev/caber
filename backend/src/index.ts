import express from "express";
import dotenv from "dotenv";
import { connect } from "./db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "http";
import { Server as IOServer } from "socket.io";
import { initializeSocketIO } from "./lib/initialize-socket";

// Routes
import userRoutes from "./routes/user.routes";
import driverRoutes from "./routes/driver.routes";
import vehicleRoutes from "./routes/vehicle.routes";

dotenv.config({
  path: "./.env",
});
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

const httpServer = new Server(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "http://localhost:8081",
    credentials: true,
  },
  pingTimeout: 60000, // 1 minute
});

initializeSocketIO(io);
app.set("io", io);
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/driver", driverRoutes);
app.use("/api/v1/vehicle", vehicleRoutes);

connect().then(() => {
  httpServer.listen(8080, () => {
    console.info("Server started on port 8080");
  });
});
