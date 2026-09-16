import { Router } from "express";
import { ticketController } from "./ticket.controller";

const router = Router();

// Create Ticket
router.post("/", ticketController.createTicket);

// Get all tickets
router.get("/", ticketController.getTickets);

// Get single ticket
router.get("/:id", ticketController.getTicket);

// Update ticket
router.put("/:id", ticketController.updateTicket);

// Delete ticket
router.delete("/:id", ticketController.deleteTicket);

export const ticketRoutes = router;
