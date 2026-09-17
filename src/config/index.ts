import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  connection_strting: process.env.CONNECTION_STRING,
  jwt_secret: process.env.JWT_SECRET,
};

export default config;
