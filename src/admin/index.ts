import express from "express";

export const adminRouter = express.Router();

export * from "./coins";
export * from "./subscriptions";
export * from "./battles";
export * from "./init";
