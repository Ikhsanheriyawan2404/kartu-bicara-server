import { pool } from "../config/db";
import { Category } from "../types/Category";

export async function getAllCategories(): Promise<Category[]> {
  const { rows } = await pool.query(
    "SELECT id, name FROM categories"
  );
  return rows;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const { rows } = await pool.query(
    "SELECT id, name FROM categories WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

