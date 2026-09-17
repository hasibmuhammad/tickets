import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { ticketRoutes } from "./modules/ticket/ticket.routes";
import { userRoutes } from "./modules/user/user.routes";

const app = express();

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the new world of AI");
});

// Routes
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);
app.use("/auth", authRoutes);

export default app;
