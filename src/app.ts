import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { adminRouter } from "./admin";
import { transactionsRouter } from "./transactions";
import { viewsRouter } from "./views";
import https from "https";
import { readFileSync } from "fs";
import path from "path";

dotenv.config();

if (!process.env.PORT) {
  console.error("Please define the PORT environment variable.");
  process.exit(1);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/admin", adminRouter);
app.use("/transactions", transactionsRouter);
app.use("/views", viewsRouter);

const server = https.createServer(
  {
    key: readFileSync(path.join(__dirname, "key.pem")),
    cert: readFileSync(path.join(__dirname, "cert.pem")),
  },
  app,
);

server.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
