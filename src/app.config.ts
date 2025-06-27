import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { buildValidationPrompt, validateWithAI } from "./utlis";

/**
* Import your Room files
*/
import { WordCardRoom } from "./rooms/WordCardRoom";
import { pool } from "./config/db";
import { rateLimiter } from "./middleware/rateLimiter";

export default config({
    
    initializeGameServer: (gameServer) => {
        /**
        * Define your room handlers:
        */
        gameServer.define('word_card_room', WordCardRoom);
        
    },
    
    initializeExpress: (app) => {
          
        app.use(rateLimiter);

        app.get("/total_question", async (_, res) => {
            try {
              const result = await pool.query("SELECT COUNT(*)::int AS total FROM questions");
              res.json(result.rows[0]);
            } catch (error) {
              console.error("Error fetching total questions", error);
              res.status(500).json({ error: "Gagal mengambil total semua pertanyaan" });
            }
        });
        
        app.get("/categories", async (_, res) => {
            try {
                const result = await pool.query("SELECT id, name, description FROM categories ORDER BY id");
                res.json(result.rows);
            } catch (error) {
                console.error("Error fetching categories", error);
                res.status(500).json({ error: "Gagal mengambil data kategori" });
            }
        });
        
        app.get("/questions", async (req, res) => {
            try {
                /** example req
                GET /questions?limit=10
                GET /questions?limit=10&lastId=25
                */
                const limit = parseInt(req.query.limit as string) || 10;
                const lastId = parseInt(req.query.lastId as string); // id terakhir yang dimuat
                
                const values = lastId
                    ? [lastId, limit]
                    : [limit];
                
                const query = lastId
                ? `
                      SELECT q.id, q.title, q.category_id, c.name AS category_name, q.created_at
                      FROM questions q
                      JOIN categories c ON q.category_id = c.id
                      WHERE q.id < $1
                      ORDER BY q.id DESC
                      LIMIT $2
                    `
                : `
                      SELECT q.id, q.title, q.category_id, c.name AS category_name, q.created_at
                      FROM questions q
                      JOIN categories c ON q.category_id = c.id
                      ORDER BY q.id DESC
                      LIMIT $1
                    `;
                
                const result = await pool.query(query, values);
                res.json(result.rows);
                
            } catch (error) {
                console.error("Error fetching questions", error);
                res.status(500).json({ error: "Gagal mengambil pertanyaan" });
            }
        });
        
        app.post("/game/start", async (req, res) => {
            const { categoryId } = req.body;
            
            if (!categoryId || isNaN(Number(categoryId))) {
                return res.status(400).json({ error: "categoryId harus berupa angka dan tidak boleh kosong." });
            }
            
            try {
                // Ambil 10 pertanyaan random dari kategori yang diminta
                const result = await pool.query(
                    `SELECT id, title 
                 FROM questions 
                 WHERE category_id = $1 
                 ORDER BY RANDOM() 
                 LIMIT 10`,
                    [categoryId]
                );
                
                if (result.rows.length === 0) {
                    return res.status(404).json({ error: "Kategori tidak ditemukan atau belum ada pertanyaan." });
                }
                
                return res.json(result.rows);
                
            } catch (error) {
                console.error("Error starting game:", error);
                return res.status(500).json({ error: "Gagal memulai game." });
            }
        });
        
        app.post("/questions", async (req, res) => {
            const { categoryId, question } = req.body;
            
            if (!categoryId || !question || typeof question !== "string") {
                return res.status(400).json({ error: "Kategori dan judul pertanyaan wajib diisi." });
            }

            if (question.length > 200) {
                return res.status(400).json({ error: "Pertanyaan terlalu panjang. Maksimal 200 karakter." });
            }              
            
            try {
                // Cek apakah category_id valid
                const checkCategory = await pool.query(
                    `SELECT id, name FROM categories WHERE id = $1`,
                    [categoryId]
                );
                if (checkCategory.rowCount === 0) {
                    return res.status(404).json({ error: "Kategori tidak ditemukan." });
                }

                const category = checkCategory.rows[0];

                const prompt = buildValidationPrompt(question, category.name);
                const validation = await validateWithAI(prompt);
            
                if (!validation.isValid) {
                  return res.status(422).json({
                    error: "Pertanyaan tidak valid",
                    reason: validation.reason,
                  });
                }
                
                // Insert question
                const insertResult = await pool.query(
                    `INSERT INTO questions (category_id, title) VALUES ($1, $2) RETURNING id, category_id, title, created_at`,
                    [categoryId, question]
                );
                
                return res.status(201).json({ message: "Pertanyaan berhasil ditambahkan", data: insertResult.rows[0] });
            } catch (error) {
                console.error("Error creating question:", error);
                return res.status(500).json({ error: "Gagal menambahkan pertanyaan." });
            }
        });
        
        /**
        * Use @colyseus/playground
        * (It is not recommended to expose this route in a production environment)
        */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }
        
        /**
        * Use @colyseus/monitor
        * It is recommended to protect this route with a password
        * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
        */
        app.use("/colyseus", monitor());
    },
    
    
    beforeListen: () => {
        /**
        * Before before gameServer.listen() is called.
        */
    }
});
