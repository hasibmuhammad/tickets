import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const login = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;

  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) return null;
  const user = result.rows[0];

  const match = await bcrypt.compare(password as string, user.password);

  if (!match) {
    return null;
  }

  const jwtPayload = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "7d",
  });

  return { token, user };
};

export const authService = {
  login,
};
