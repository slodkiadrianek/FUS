import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export class ValidationMiddleware {
  static validate(
    schema: ObjectSchema,
    redirect: string,
    property: "body" | "query" | "params" = "body"
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req[property], { abortEarly: false });

      if (error) {
        req.session.errorMessage = error.details[0].message;
        return res.status(400).redirect(redirect);
      }
      next();
    };
  }
}
