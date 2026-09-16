import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { Pool } from "pg";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tickets(
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category TEXT,
      is_open BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
    `);
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the new world of AI");
});

/**
 * User CRUD
 */
// Create user
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email],
    );

    console.log(result.rows[0]);

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
});

// Get all users
app.get("/users", async (req: Request, res: Response) => {
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
});

// Get single user
app.get("/users/:id", async (req: Request, res: Response) => {
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
});

// Update user
app.put("/users/:id", async (req: Request, res: Response) => {
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
});

// Delete user
app.delete("/users/:id", async (req: Request, res: Response) => {
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
});

/**
 * Tickets Crud
 */
// Create Ticket
app.post("/tickets", async (req: Request, res: Response) => {
  try {
    const { user_id, title } = req.body;
    // const userResult = await pool.query(`SELECT * from users WHERE id=$1`, [
    //   user_id,
    // ]);

    // const userExist = userResult.rowCount;

    // if (!userExist)
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not found" });

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
app.get("/tickets", async (req: Request, res: Response) => {
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
app.get("/tickets/:id", async (req: Request, res: Response) => {
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

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
