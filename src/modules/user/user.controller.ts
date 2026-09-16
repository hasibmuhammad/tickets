import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const payload = {
      name,
      email,
    };

    const result = await userService.createUser(payload);

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
    const result = await userService.getUsers();

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
    const result = await userService.getUser(id as string);

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

    const payload = {
      name,
      email,
      id,
    };

    const result = await userService.updateUser(payload);

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
    const result = await userService.deleteUser(id as string);

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
