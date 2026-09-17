import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, role } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *`,
    [name, email, hashedPassword, role],
  );

  return result;
};

const getUsers = async () => {
  const result = await pool.query(
    `SELECT * FROM users ORDER BY created_at DESC`,
  );

  return result;
};

const getUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  return result;
};

const updateUser = async (payload: Record<string, unknown>) => {
  const { name, email, id } = payload;
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
    [name, email, id],
  );

  return result;
};

const deleteUser = async (id: string) => {
  const result = pool.query(`DELETE FROM users WHERE id=$1`, [id]);

  return result;
};

export const userService = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
