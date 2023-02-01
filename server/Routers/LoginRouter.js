import express from "express";
import { fetchAllUsers, fetchByUsername, generateOtp, login, register, updateUser, verifyOtp } from "../Controllers/LoginController.js";
import { localVariable, VerifyToken } from "../Middlewares/VerifyToken.js";

const loginRouter = express.Router();

/* POST Methods */
loginRouter.post('/register', register);
loginRouter.post('/login', login);

/* GET Methods */
loginRouter.get('/user/:username', fetchByUsername);
loginRouter.get('/generateotp/:username', VerifyToken, localVariable, generateOtp);
loginRouter.get('/verifyotp', VerifyToken, verifyOtp);
loginRouter.get('/', fetchAllUsers);

/* PUT Methods */
loginRouter.put('/updateuser/:id', VerifyToken, updateUser);







export default loginRouter;