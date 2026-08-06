import express from "express";

export type Service = () => express.Router;
