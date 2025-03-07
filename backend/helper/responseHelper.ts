import { Response } from "express"
export const helperFunctionSuccess=(res:Response, statusCode: number, data: any)=>{
    return res.status(statusCode).json(data)
}

export const helperFunctionError=(res:Response, statusCode: number, data: any)=>{
    return res.status(statusCode).json(data);
}