import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import {errorHandler} from './error.js'
export const verifyToken=(req,res,next)=>{
    console.log("Cookies:", req.cookies);
    const token=req.cookies.access_token;
    if(!token){
        return next(errorHandler(401,'unauthorised'));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(401,'unauthorised');
        }
        req.user=user;
        next();
    });
};