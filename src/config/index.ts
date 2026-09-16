import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  connection_strting: process.env.CONNECTION_STRING,
};

export default config;
