import mysql from "mysql2/promise";
import dotenv from "dotenv";

// MUST call this before creating the pool
dotenv.config(); 

export const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Make sure this is correct in .env!
  database: process.env.DB_NAME,
  port: 3306
});