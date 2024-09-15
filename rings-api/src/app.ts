import express from "express";
import cors from "cors";
import { RingRoutes } from "./routes/RingRoutes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", RingRoutes);
