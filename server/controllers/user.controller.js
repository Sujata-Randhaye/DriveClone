import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";

//generate Access and refresh token
const generateAccessAndRefreshTokens=async(userId)=>{
    try{
        const user=await User.findById(userId);
        const refreshToken=user.generateRefreshToken();
        const accessToken=user.generateAccessToken();

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}

    }catch(err)
    {
        throw new ApiError(500,"Something went wrong while generating refresh and access token!!")
    }
}
//register
const registerUser=asyncHandler(async (req,res)=>{
    
    const {email,username,password}=req.body
    // console.log(req.body)
    console.log("email:",email)
    console.log("username:",username)
    console.log("password:",password)
    if(
        [email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }
    
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser)
    {
        throw new ApiError(409,"User with email or username already exists")
    }
    
    const user= await User.create({   //document is saved here
        email,
        password,
        username:username
    })

    //removing password and refreshtoken from mongodb
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
});


//login
const loginUser=asyncHandler(async(req,res)=>{
    const {email,username,password}=req.body

    if(!username && !email){   //if(!username && email)
        throw new ApiError(400,"username or password is required")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user)
    {
        throw new ApiError(404,"User does not exists")
    }
    
    // method that we define are attached with our instance
    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }
    //user do not have accesstoken and refreshtoken
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

    const loggedInUser=await User.findById(user._id).
    select("-password -refreshToken")

    const options={
        httpOnly:true,  //can be only modified by server not by frontend
        secure:true
    }
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,        //status 
            {       //data
                user: loggedInUser,accessToken,
                refreshToken
            },
            "User logged in Successfully"  //msg
        )
    )
})

//login
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            //mongodb operator
            $unset: {
                // refreshToken: undefined,
                refreshToken:1  //this removes the
                // field from document
            }
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,  //can be only modified by server not by frontend
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out Successfully!!"))
})

export {registerUser,loginUser,logoutUser,generateAccessAndRefreshTokens}