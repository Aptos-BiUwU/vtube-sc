import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { adminRouter } from "./admin";
import { transactionsRouter } from "./transactions";
import { viewsRouter } from "./views";

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
