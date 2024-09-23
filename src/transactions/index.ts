import express from "express";
import { SimpleTransaction } from "@aptos-labs/ts-sdk";

export const transactionsRouter = express.Router();

export function stringify(tx: SimpleTransaction) {
  return JSON.stringify(tx, (_key, value) =>
    typeof value == "bigint" ? value.toString() : value,
  );
}

export * from "./coins";
export * from "./subscriptions";
export * from "./battles";
