import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { helperFunctionError, helperFunctionSuccess } from "../helper/responseHelper";

dotenv.config()
declare module "express" {
    interface Request {
      user?: any; // Extend Request to allow `user`
    }
  }

export const authenticateUser: RequestHandler = (req:Request, res:Response, next:NextFunction):void => {
    const authHeader=req.headers.authorization;
    const token=authHeader && authHeader.split(' ')[1];
    console.log(`token: ${token}`);
    if (!token) {
        helperFunctionError(res, 401, {message: "Unauthorized"});
    }
    jwt.verify(token as string, process.env.JWT_SECRET as string, (err, decoded)=>{
        if (err) {
            return helperFunctionError(res, 403, {message: "Forbidden"});
        }
        console.log(`decoded: ${decoded}`);
        req.user={name:"abc"}
        // helperFunctionSuccess(res, 200, {message: "ok"});
        next();
    })
}