import { Request, Response, Router } from "express";
import { pool } from "../../config/db";

const router = Router();

// Create Ticket
router.post("/", async (req: Request, res: Response) => {
  try {
    const { user_id, title } = req.body;

    // create the ticket
    const result = await pool.query(
      `INSERT INTO tickets(title, user_id) VALUES($1, $2) RETURNING *`,
      [title, user_id],
    );

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
});

// Get all tickets
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tickets ORDER BY created_at DESC`,
    );

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
});

// Get single ticket
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM tickets WHERE id=$1`, [id]);

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
});

// Update ticket
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const result = await pool.query(
      `UPDATE tickets SET title=$1 WHERE id=$2 RETURNING *`,
      [title, id],
    );

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
});

// Delete ticket
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM tickets WHERE id=$1`, [id]);

    console.log(result);

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
});

export const ticketRoutes = router;
