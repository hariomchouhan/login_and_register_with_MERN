import UserModel from '../module/User.module.js'
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config.js';


/* middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User doesn't exist" });
        }
        next();

    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Authentication Error...!" });
    }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // check the user exists
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, (err, user) => {
                if (err) reject(new Error(err));
                if (user) reject({ error: "Please use unique username" })

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, (err, email) => {
                if (err) reject(new Error(err));
                if (email) reject({ error: "Please use unique email" })

                resolve();
            })
        });

        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hashSync(password, 10)
                        .then((hashedPassword) => {
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || "",
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then((result) => {
                                    res.status(StatusCodes.CREATED).json({ message: "User Register Successfully" });
                                })
                                .catch((error) => {
                                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
                                })
                        }).catch((error) => {
                            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Enable to hashed password" })
                        })
                }
            }).catch((error) => {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
            })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        UserModel.findOne({ username })
            .then((user) => {
                bcrypt.compare(password, user.password)
                    .then((passwordCheck) => {
                        if (!passwordCheck) {
                            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid username or password" })
                        }

                        // create jwt token
                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username
                        }, env.JWT_SECRET, { expiresIn: "24h" });

                        return res.status(StatusCodes.OK).json({
                            message: "Login Successful...!",
                            username: user.username,
                            token
                        });
                    })
                    .catch((error) => {
                        return rex.status(StatusCodes.BAD_REQUEST).json({ error: "Password does not Match" })
                    })
            })
            .catch((error) => {
                res.status(StatusCodes.NOT_FOUND).json({ error: "username not found" });
            })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {

    const { username } = req.params;

    try {
        if (!username) {
            return res.status(StatusCodes.NOT_IMPLEMENTED).json({ error: "Invalid username" });
        }
        UserModel.findOne({ username }, (err, user) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
            }
            if (!user) {
                return res.status(StatusCodes.NOT_IMPLEMENTED).json({ error: "Couldn't Find the User" });
            }

            return res.status(StatusCodes.CREATED).json({ user });
        });
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Cann't Find User Data" });
    }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
    try {

        // const id = req.query.id;
        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id: userId }, body, function (err, data) {
                if (err) throw err;

                return res.status(201).send({ msg: "Record Updated...!" });
            })

        } else {
            return res.status(401).send({ error: "User Not Found...!" });
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    res.json('generateOTP route')
}
/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    res.json('verifyOTP route')
}
// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    res.json('createResetSession route')
}
// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    res.json('resetPassword route')
}
