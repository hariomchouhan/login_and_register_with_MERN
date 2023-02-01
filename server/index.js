import express from "express";
import cors from 'cors';
import connectDB from "./Database/conn.js";
import loginRouter from "./router/route.js";


const app = express();

/* middlewares */
app.use(cors());
app.use(express.json());
app.disable('x-powered-by'); // less hackers know about our stack

/* api routes */
app.use(loginRouter);

const PORT = 8080;

/* HTTP GET Request */
app.get("/", (req,res)=>{
    res.status(201).json("Home Get Request")
})

/** start server only when we have valid connection */
connectDB().then(()=>{
    try {
        app.listen(PORT, ()=>{
            console.log(`Server running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log("Cann't connect to Database");
    }
}).catch((error)=>{
    console.log("Invalid database connection...!");
})
