import {Request, Response, NextFunction } from "express"

export class BaseController{
    constructor(){}

    index = (_req:Request, res:Response, _next:NextFunction):void =>{
    return res.render("index");
    }
}