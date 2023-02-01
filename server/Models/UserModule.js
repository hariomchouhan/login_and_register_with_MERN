import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        require: [true, "Please provide unique username"],
        unique: [true, "Username already exists"]
    },
    password : {
        type: String,
        require: [true, "Please provide password"],
        unique: false
    },
    email : {
        type: String,
        require: [true, "Please provide email"],
        unique: true
    },
    firstName : {
        type: String,
        require: [true, "Please provide first name"],
        unique: false
    },
    lastName : {
        type: String,
        require: [true, "Please provide first name"],
        unique: false
    },
    mobile : {
        type: Number
    },
    address : {
        type: String
    },
    profile : {
        type: String
    }
})

export const UserModel = mongoose.model('User', UserSchema);