import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { categories, questions } from "./data";

/**
 * Import your Room files
 */
import { WordCardRoom } from "./rooms/WordCardRoom";

export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('word_card_room', WordCardRoom);

    },

    initializeExpress: (app) => {
        app.get("/categories", (_, res) => {
            res.json({ categories });
        });
        
        app.get("/questions", (_, res) => {
            res.json({ questions });
        });

        app.get("/questions/category/:categoryId", (req, res) => {
            const categoryId = Number(req.params.categoryId);
            const filteredQuestions = questions.filter(q => q.category_id === categoryId);
            if (filteredQuestions.length === 0) {
                return res.status(404).json({ error: "Kategori tidak ditemukan atau tidak memiliki pertanyaan" });
            }
            res.json({ categoryId, questions: filteredQuestions });
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
