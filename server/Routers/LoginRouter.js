import express from "express";
import { fetchAllUsers, fetchByUsername, login, register } from "../Controllers/LoginController.js";

const loginRouter = express.Router();

/* POST Methods */
loginRouter.post('/register', register);
loginRouter.post('/login', login);

/* GET Methods */
loginRouter.get('/user/:username', fetchByUsername);
loginRouter.get('/', fetchAllUsers);

/* PUT Methods */







export default loginRouter;