import express from "express";

export const viewsRouter = express.Router();

export * from "./subscriptions";
export * from "./coins";
export * from "./battles";
export * from "./campaigns";
