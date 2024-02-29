import express from "express";
import { PoolWorkers } from "./poolWorkers";

const app = express();

const poolWorkers = new PoolWorkers("./dist/worker.js", 5);

app.get('/', async (req, res) => {
    try {
        const response = await poolWorkers.sendMessage(req.query.message || "default");
        res.send(response);
    } catch (error) {
        res.json({ error });
    }
});

app.listen(8080, () => {
    console.log("listening on 8080");
});
