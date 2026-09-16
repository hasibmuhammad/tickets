import { Request, Response } from "express";
import { pool } from "../../config/db";

const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email],
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users ORDER BY created_at DESC`,
    );

    res.status(200).json({
      success: true,
      message: "Get all users",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rowCount && result.rowCount > 0) {
      res.status(200).json({
        success: true,
        message: "Get single user",
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No results found",
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Updated Successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

    if (result.rowCount) {
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
        data: null,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userController = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
