import { Request,Response,NextFunction } from "express";
import { addLog } from "./log-service";

export const add=async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try{
        const { ip, dateOperation,descrizione } = req.body;
        const createdBy=req.user?.id!;
        const classroom = await addLog({ip,dateOperation,descrizione});
        res.json(classroom);
    }catch(err){
        next(err);
    }
}