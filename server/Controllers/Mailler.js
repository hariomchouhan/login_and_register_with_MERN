import nodemailer from 'nodemailer';
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';


export async function sendEmail(request, response) {
    const { username, userEmail, text, subject } = request.body;
    try {

        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            port: 534,
            auth: {
                user: 'hariomchouhan430@gmail.com',
                pass: process.env.PASS
            }
        });
        let body = {
            name: username,
            intro : text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }

        let info = await mailTransporter.sendMail({
            from: ' "Hacker" <hariomchouhan430@gmail.com>',
            to: userEmail,
            // to: 'piyushsoni20218@acropolis.in, hariomchouhan20553@acropolis.in, nitinnegi20001@acropolis.in',
            subject: subject,
            // html: `${body.name} ${body.intro} ${body.outro}`
            html: '<h1>Welcome</h1><p>That was easy!</p>'
        });

        // console.log(info.messageId);
        response.status(StatusCodes.OK).json(info);

    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
}