import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const token = authHeader?.split(" ")[1];

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string,
      ) as JwtPayload;

      req.user = decoded as JwtPayload;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      next();
    } catch (error: unknown) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid Token" });
      }

      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ success: false, message: "Token Expired" });
      }

      console.error(error);

      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  };
};

export default auth;
