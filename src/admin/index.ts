import express from "express";

export const adminRouter = express.Router();

export * from "./coins";
export * from "./subscriptions";
export * from "./battles";
export * from "./campaigns";
export * from "./init";
export * from "./pools";