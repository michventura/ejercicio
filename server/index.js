import express from "express";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const server = http.createServer(app);

app.use(cors());
app.use(morgan("dev"));

app.use(express.static(join(__dirname, "../client/build")));

server.listen(4000);
