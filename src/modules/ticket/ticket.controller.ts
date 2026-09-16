import { Request, Response } from "express";
import { ticketService } from "./ticket.service";

const createTicket = async (req: Request, res: Response) => {
  try {
    const { user_id, title } = req.body;

    const payload = {
      title,
      user_id,
    };

    // create the ticket
    const result = await ticketService.createTicket(payload);

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to create ticket" });
  }
};

const getTickets = async (req: Request, res: Response) => {
  try {
    const result = await ticketService.getTickets();

    res.status(200).json({
      success: true,
      message: result.rows.length
        ? "Successfully fetched all tickets"
        : "No result found",
      data: result.rows,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch tickets" });
  }
};

const getTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ticketService.getTicket(id as string);

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ticket not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched ticket successfully",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }

    res.status(500).json({ success: false, message: "Failed fetch ticket" });
  }
};

const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const payload = { title, id };
    const result = await ticketService.updateTicket(payload);

    if (!result.rowCount) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found", data: null });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to update ticket" });
  }
};

const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await ticketService.deleteTicket(id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket Deleted Successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete the ticket",
    });
  }
};

export const ticketController = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
};
