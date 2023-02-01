import express from "express";
import { login, register } from "../Controllers/LoginController.js";

const loginRouter = express.Router();

/* POST Methods */
loginRouter.post('/register', register);
loginRouter.post('/login', login);

/* GET Methods */


/* PUT Methods */







export default loginRouter;