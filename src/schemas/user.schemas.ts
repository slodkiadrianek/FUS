import Joi, { ObjectSchema } from "joi";

export const registerUserSchema: ObjectSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Imię jest wymagane!",
    "string.base": "Imię musi być stringiem!",
  }),
  surname: Joi.string().required().messages({
    "any.required": "Nazwisko jest wymagane!",
    "string.base": "Nazwisko musi być stringiem!",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "any.required": "Hasło jest wymagane!",
      "string.base": "Hasło musi byc stringiem!",
      "string.min": "Hasło musi zawierać minimum 8 znaków!",
      "string.max": "Hasło może maksymalnie zawierać 30 znaków!",
      "any.pattern":
        "Hasło musi zawierać jedną małą literę, jedną dużą literę, jedną cyfrę i jeden znak specjalny!",
    }),
  email: Joi.string().email().required().messages({
    "any.required": "Email jest wymagany!",
    "string.base": "Email musi być stringiem!",
    "string.email": "Email nie spełnia wymagań!",
  }),
});

export const loginUserSchema: ObjectSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email jest wymagany!",
    "string.base": "Email musi być stringiem!",
    "string.email": "Email nie spełnia wymagań!",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "any.required": "Hasło jest wymagane!",
      "string.base": "Hasło musi byc stringiem!",
      "string.min": "Hasło musi zawierać minimum 8 znaków!",
      "string.max": "Hasło może maksymalnie zawierać 30 znaków!",
      "any.pattern":
        "Hasło musi zawierać jedną małą literę, jedną dużą literę, jedną cyfrę i jeden znak specjalny!",
    }),
});
