import { UserModel } from '../Models/UserModule.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

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