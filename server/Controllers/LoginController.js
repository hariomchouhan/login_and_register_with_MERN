import { UserModel } from '../Models/UserModule.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
// register a new user

export async function register(request, response) {
    try {
        // const { username, password, profile, email } = req.body;
        // check username
        if (await UserModel.findOne({ username: request.body.username })) {
            response.status(StatusCodes.BAD_REQUEST).json({ message: "Please use unique username" });
        }
        else{
            // check email
            if (await UserModel.findOne({ email: request.body.email })) {
                response.status(StatusCodes.BAD_REQUEST).json({ message: 'Email already exists' });
            }
            else {
                const newPassword = bcrypt.hashSync(request.body.password, 12);
                request.body["password"]=newPassword;
                const user = new UserModel(request.body);
                const savedUser = await user.save();
                response.status(StatusCodes.CREATED).json(savedUser);
            }
        }
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}


export async function login(request, response) {
    try {
        const username = await UserModel.findOne({ username: request.body.username });
        if(username){
            if(bcrypt.compareSync(request.body.password, username.password)){
                const token = jwt.sign({ username: username.username }, process.env.JWT_SECRET, { expiresIn: "24h"});
                response.status(StatusCodes.OK).json({ token: token});
            }
            else{
                response.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid password" });
            }
        }
        else{
            response.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid username" });
        }
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}

export async function fetchAllUsers(request, response) {
    try {
        const users = await UserModel.find();
        response.status(StatusCodes.OK).json(users);
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}

export async function fetchByUsername(request, response) {
    try {
        const username = await UserModel.findOne({ username: request.params.username });
        if(username){
            response.status(StatusCodes.OK).json(username);
        }
        else{
            response.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid username" });
        }
    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }

}

export async function updateUser(request, response) {
    try {
        const exists = await UserModel.findById(request.params.id );
        // const {userId} = request.user;
        if(exists){
            const user =  await exists.updateOne(request.body);
            response.status(StatusCodes.NO_CONTENT).json();
        }
        else{
            response.status(StatusCodes.BAD_REQUEST).json({ message: "User Not Found!" });
        }
    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }

}

export async function generateOtp(request, response) {
    request.app.locals.OTP  = otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    response.status(StatusCodes.CREATED).json({ code: request.app.locals.OTP});
}

export async function verifyOtp(request, response) {
    const { code} = request.query;
    if(parseInt(code) === parseInt(request.app.locals.OTP)){
        request.app.locals.OTP = null; // reset the OTP value
        request.app.locals.resetSession = true; // start session for reset password
        response.status(StatusCodes.OK).json({ message: "OTP Verified" });
    }
    else{
        response.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid OTP" });
    }
}