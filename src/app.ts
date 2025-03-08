import  express from "express";
import cors from "cors";
import helmet from "helmet";
import { createClient } from "redis";
import { fileURLToPath } from "url";
import path from "path";
import { BaseRoutes, } from "./routes/base.routes.js";
import { BaseController } from "./controllers/base.controller.js";
export const app =  express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));
app.use(helmet());
app.use(cors());

const baseController = new BaseController()
const baseRoutes = new BaseRoutes(baseController)
app.use(baseRoutes.router)
export let caching: unknown;
if (process.env.CACHE_URI) {
  caching = await createClient({
    url: process.env.CACHE_URI,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
} else {
  console.error(`No cache link provided`);
  process.exit(1);
}