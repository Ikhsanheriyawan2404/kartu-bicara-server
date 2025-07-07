import { pool } from "../config/db";
import { Question } from "../types/Question";

export async function getRandomQuestions(
  categoryId: number,
  maxLimitQuestion: number
): Promise<Question[]> {
  const result = await pool.query(
    `SELECT id, title AS text, category_id 
      FROM questions 
      WHERE category_id = $1 
      ORDER BY RANDOM() 
      LIMIT $2`,
    [categoryId, maxLimitQuestion]
  );

  return result.rows
}