import { Router } from "express";

/* import all controllers */
import * as controller from "../controllers/appController.js"
import { Auth } from "../middleware/Auth.js";

const loginRouter = Router();

/* POST Methods */
loginRouter.route('/register').post(controller.register) // register user
// loginRouter.route('/registerMail').post();// send the email
loginRouter.route('/authenticate').post((req, res)=>{res.end()}); // authenticate user
loginRouter.route('/login').post(controller.verifyUser, controller.login); // login in app
// loginRouter.route('/login').post(controller.login); // login in app

/* GET Methods */
loginRouter.route('/user/:username').get(controller.getUser); // user with username
loginRouter.route('/generateOTP').get(controller.generateOTP); // generate random OTP
loginRouter.route('/verifyOTP').get(controller.verifyOTP); // verify generated OTP
loginRouter.route('/createResetSession').get(controller.createResetSession); // reset all the variables

/* PUT Methods */
loginRouter.route('/updateuser/').put(Auth, controller.updateUser); // is use to update the user profile
loginRouter.route('/resetPassword').put(controller.resetPassword); // use to reset password

export default loginRouter; 