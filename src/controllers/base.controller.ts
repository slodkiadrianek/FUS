import {Request, Response, NextFunction } from "express"
import { prisma } from "../utils/database.js";
export class BaseController{
    constructor(){}

    index = (_req:Request, res:Response, _next:NextFunction):void =>{
        const result = prisma.user.findMany()
        console.log(result)
        return res.render("index");
    }
}