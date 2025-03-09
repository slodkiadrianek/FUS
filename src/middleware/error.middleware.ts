import { AppError } from "../services/error.service.js";
import { Response, ErrorRequestHandler, Request, NextFunction } from "express";
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    req.session.errorMessage = err.errorDescription;
    return res.status(err.statusCode).redirect(err.redirect);
  }
  req.session.errorMessage = "Internal Server Error";
  res.status(500).redirect("/error");
};
