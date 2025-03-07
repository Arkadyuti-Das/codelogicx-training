import { PrismaClient } from "@prisma/client"
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { helperFunctionError, helperFunctionSuccess } from "../helper/responseHelper";
import path from "path";
import fs from "fs";

dotenv.config();

const prisma=new PrismaClient();
const saltRounds=10;

export const getData=async(req:Request, res:Response)=>{
    const {username, password, email}=req.body;
    try{
        const result1=await prisma.user.findMany({
            where:{
                email: email
            }
        });
        const result2=await prisma.user.findMany({
            where:{
                username: username
            }
        });
        if (result1.length!==0){
            helperFunctionError(res, 409, {message: "Email already exists. Try another email"});
            // res.status(409).json({message: "Email already exists. Try another email"});
        }
        else if (result2.length!==0){
            helperFunctionError(res, 409, {message: "Username already exists. Try another username"});
            // res.status(409).json({message: "Username already exists. Try another username"});
        }
        else{
            //create user and redirect to login page
            const hashedPassword=await bcrypt.hash(password, saltRounds);
            await prisma.user.create({
                data:{
                    username,
                    email, 
                    password: hashedPassword
                }
            });
            helperFunctionSuccess(res, 200, {message: "User created successfully"});
            // res.status(200).json({message: "User created successfully"});
        }
    }
    catch(error){
        console.log("some error occurred");
    }
}

export const logIn=async(req:Request, res:Response)=>{
    const {username, password}=req.body;
    try{
        const result=await prisma.user.findMany({
            where:{
                username
            }
        });
        if (result.length===0){
            // res.status(401).json({message: "Invalid username"});
            helperFunctionError(res, 401, {message: "Invalid username"});
        }
        else{
            //log in to the respective route(user/admin)
            const checkPassword=await bcrypt.compare(password, result[0].password);
            if (checkPassword){
                const role=result[0].role;
                const email=result[0].email;
                const secret=process.env.JWT_SECRET as string;
                const token=jwt.sign({username, email, role}, secret, {expiresIn: "50m"});
                // res.json({role, token});
                helperFunctionSuccess(res, 200, {role, token});
            }
            else{
                // res.status(401).json("Incorrect password. Try again");
                helperFunctionError(res, 401, {message: "Incorrect password. Try again"});
            }
        }
    }
    catch(error){
        helperFunctionError(res, 501, {message: "Some error has occurred"});
    }
}

export const logOut=(req:Request, res:Response)=>{
    res.json({message: "Logout successful"});
}

export const verifyToken=(req:Request, res:Response)=>{
    const {item}=req.body;
    if (!item){
        // return helperFunctionSuccess(res, 200, {message: "Token is required", role: "invalid"})
        // res.json({message: "Token is required", role: "invalid"});
        helperFunctionError(res, 401, {message: "You must login to continue", role: "Invalid"});
    }
    else{
        try{
            const secret=process.env.JWT_SECRET as string;
            const decoded=jwt.verify(item, secret) as {username: string, email: string, role: string};
            // console.log(decoded);
            helperFunctionSuccess(res, 200, {message: "ok", role: decoded.role, username: decoded.username});
            // res.json({message: "ok", role: decoded.role, username: decoded.username});
        }
        catch(error){
            helperFunctionError(res, 401, {message: "Invalid token", role: "Invalid"});
            // res.json({message: "Invalid token", role: "invalid"});
        }
    }
}

export const forgotPassword=async(req:Request, res:Response)=>{
    const {email}=req.body;
    // const result=await prisma.user.findUnique({
    //     where:{
    //         username
    //     }
    // })
}

export const resetPassword=async (req:Request, res:Response)=>{
    const {currentPassword, username, entry, confirmEntry}=req.body;
    try{
        //validate existing password
        const result=await prisma.user.findMany({
            where:{
                username
            }
        });
        const comparePassword=await bcrypt.compare(currentPassword, result[0].password);
        if(comparePassword){
            if (entry===confirmEntry){
                const hashedPassword=await bcrypt.hash(entry, saltRounds);
                await prisma.user.update({
                    where:{
                        username: username
                    },
                    data:{
                        password:hashedPassword
                    }
                });
                helperFunctionSuccess(res, 200, {message: "Password updated"});
            }
            else{
                throw new Error("Passwords don't match");
            }
        }
        else{
            throw new Error("Incorrect existing password");
        }
    }
    catch(error:any){
        helperFunctionError(res, 400, {message:error.message});
    }
}


export const createProduct=async(req:Request, res:Response, next:NextFunction)=>{
    const {productName, productPrice, productDescription}=req.body;
    const productImage=req.file?`uploads/${req.file?.filename}`:null;
    try{
        await prisma.product.create({
            data:{
                name: productName,
                price: parseInt(productPrice),
                description: productDescription, 
                image: productImage
            }
        });
        helperFunctionSuccess(res, 200, {message: "Product Created"});
    }
    catch(error:any){
        helperFunctionError(res, 400, {message:error.message});
    }
    next();
}

export const getProducts=async(req:Request, res:Response)=>{
    const {searchValues="", rowsPerPage="1", sortField="name", sortBy="asc", page=0}=req.query;
    // console.log("query params:", queryParams);
    const takevalue=parseInt(rowsPerPage as string);
    const skipvalue=(page as number)*takevalue;

    const allowedSortFields=["name", "price"];
    const allowedSortBy=["asc", "desc"];

    const verified_sortField=allowedSortFields.includes(sortField as string)?sortField:"name";
    const verified_sortBy=allowedSortBy.includes(sortBy as string)?sortBy:"asc";
    try{
        const data=await prisma.product.findMany({
            where:{
                OR:[{
                    name:{
                        contains: searchValues as string,
                        mode: "insensitive"
                    }
                }, {
                    description:{
                        contains: searchValues as string,
                        mode: "insensitive"
                    }
                }]
            },
            orderBy:{
                [verified_sortField as string]: verified_sortBy
            },
            skip: skipvalue,
            take: takevalue
        });

        const totalCount=await prisma.product.count({
            where:{
                OR:[{
                    name:{
                        contains: searchValues as string,
                        mode: "insensitive"
                    }
                }, {
                    description:{
                        contains: searchValues as string,
                        mode: "insensitive"
                    }
                }]
            }
        });
        const startingRecordNumber=skipvalue+1;
        const endingRecordNumber=Math.min((page as number+1)*takevalue, totalCount);
        const totalPages=Math.ceil(totalCount/takevalue);
        helperFunctionSuccess(res, 200, {data, totalCount, startingRecordNumber, endingRecordNumber, totalPages});
    }
    catch(error:any){
        helperFunctionError(res, 400, {message: error.message});
    }
}

export const updateProduct=async(req:Request, res:Response, next:NextFunction)=>{
    const {product_id, productName, productPrice, productDescription}=req.body;
    // console.log("file: ",req.file);
    // const productImage=req.file?`uploads/${req.file?.filename}`:null;
    // console.log("product image",productImage);
    // console.log(req.body);
    try{
        if(req.file){
            //user wants to update image as well
            //delete image from existing system
            const result=await prisma.product.findUnique({
                where:{
                    id: product_id
                }
            });
            if (result?.image){
                const imagePath=path.join(__dirname, "..", result.image);
                console.log(imagePath);
                if (fs.existsSync(imagePath)){
                    fs.unlinkSync(imagePath);
                }
            }
            //upload new image
            const productImage=req.file?`uploads/${req.file?.filename}`:null;
            await prisma.product.update({
                where:{
                    id:product_id
                },
                data:{
                    name: productName,
                    price: parseInt(productPrice),
                    description: productDescription,
                    image: productImage
                }
            });
            helperFunctionSuccess(res, 200, {message:"Product updated successfully"});
        }
        else{
            //Update anything other than image
            await prisma.product.update({
                where:{
                    id:product_id
                },
                data:{
                    name: productName,
                    price: parseInt(productPrice),
                    description: productDescription
                }
            });
            helperFunctionSuccess(res, 200, {message:"Product updated successfully"});
        }
    }
    catch(error:any){
        helperFunctionError(res, 400, {message: error.message});
    }
    next();
}

export const deleteProduct=async(req:Request, res:Response)=>{
    const {product_id}=req.body;
    //delete image from uploads folder and then from database
    try{
        const result=await prisma.product.findUnique({
            where:{
                id: product_id
            }
        });
        if (result?.image){
            const imagePath=path.join(__dirname, "..", result.image);
            console.log(imagePath);
            if (fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath);
            }
        }
        await prisma.product.delete({
            where:{
                id: product_id
            }
        });
        helperFunctionSuccess(res, 200, {message: "Product deleted"});
    }
    catch(error:any){
        helperFunctionError(res, 400, {message:error.message});
    }
}