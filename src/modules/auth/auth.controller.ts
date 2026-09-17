import { Request, Response } from "express";
import { authService } from "./auth.service";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const payload = {
      email,
      password,
    };

    const user = await authService.login(payload);

    if (user?.token) {
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
      });
    }
    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    return res.status(500).json({ success: false, message: "Failed to login" });
  }
};

export const authController = {
  login,
};
