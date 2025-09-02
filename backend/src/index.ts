import express from "express";
import dotenv from "dotenv";
import { connect } from "./db";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import { Server } from "http";
import { Server as IOServer } from "socket.io";
import { initializeSocketIO } from "./lib/initialize-socket";

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
});

initializeSocketIO(io);
app.set("io", io);
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);

connect().then(() => {
  httpServer.listen(8080, () => {
    console.info("Server started on port 8080");
  });
});
