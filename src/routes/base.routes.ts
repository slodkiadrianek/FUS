import { Router } from "express";
import { BaseController } from "../controllers/base.controller.js";
export class BaseRoutes {
    constructor(private baseController:BaseController, public router:Router = Router()){
        this.initializeRoutes();
    }
    protected initializeRoutes(){
        this.router.get("/", this.baseController.index)
    } 
}