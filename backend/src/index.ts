import express from "express";
import dotenv from "dotenv";
import { connect } from "./db";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes";

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

app.use(cookieParser());

app.use("/api/v1/user", userRoutes);

connect().then(() => {
  app.listen(8080, () => {
    console.info("Server started on port 8080");
  });
});
