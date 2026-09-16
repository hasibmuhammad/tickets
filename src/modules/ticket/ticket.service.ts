import { pool } from "../../config/db";

const createTicket = async (payload: Record<string, unknown>) => {
  const { title, user_id } = payload;
  const result = await pool.query(
    `INSERT INTO tickets(title, user_id) VALUES($1, $2) RETURNING *`,
    [title, user_id],
  );

  return result;
};

const getTickets = async () => {
  const result = await pool.query(
    `SELECT * FROM tickets ORDER BY created_at DESC`,
  );

  return result;
};

const getTicket = async (id: string) => {
  const result = await pool.query(`SELECT * FROM tickets WHERE id=$1`, [id]);

  return result;
};

const updateTicket = async (payload: Record<string, unknown>) => {
  const { title, id } = payload;
  const result = await pool.query(
    `UPDATE tickets SET title=$1 WHERE id=$2 RETURNING *`,
    [title, id],
  );

  return result;
};

const deleteTicket = async (id: string) => {
  const result = await pool.query(`DELETE FROM tickets WHERE id=$1`, [id]);

  return result;
};

export const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
};
