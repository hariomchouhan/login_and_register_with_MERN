import nodemailer from 'nodemailer';
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';


export async function sendEmail(request, response) {
    try {

        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            port: 534,
            auth: {
                user: 'hariomchouhan430@gmail.com',
                pass: process.env.PASS
            }
        });

        let info = await mailTransporter.sendMail({
            from: ' "Hacker" <hariomchouhan430@gmail.com>',
            to: 'piyushsoni20218@acropolis.in, hariomchouhan20553@acropolis.in, nitinnegi20001@acropolis.in',
            subject: 'Test mail',
            text: 'Hello Piyush Soni'
        });

        // console.log(info.messageId);
        response.status(StatusCodes.OK).json(info);

    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }







    // try {

    //     
    // } catch (error) {
    //     console.log(error);
    //     response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    // }
}