import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { ticketRoutes } from "./modules/ticket/ticket.routes";
import { userRoutes } from "./modules/user/user.routes";

const app = express();
const { port } = config;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the new world of AI");
});

// Routes
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);

// Server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
