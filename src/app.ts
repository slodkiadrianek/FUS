import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { createClient } from "redis";
import { fileURLToPath } from "url";
import path from "path";
import session from "express-session";
import { BaseRoutes } from "./routes/base.routes.js";
import { BaseController } from "./controllers/base.controller.js";
export const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));
app.use(helmet());
app.use(cors());

const baseController = new BaseController();
const baseRoutes = new BaseRoutes(baseController);
app.use(baseRoutes.router);
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
if (process.env.SESSION_KEY) {
  app.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false,
    })
  );
} else {
  console.log(`Session key does not provided`);
  process.exit(1);
}

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.session.successMessage) {
    res.locals.successMessage = req.session.successMessage;
    delete req.session.successMessage;
  }
  if (req.session.errorMessage) {
    res.locals.errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
  }
  next();
});
