import { Request, Response, NextFunction } from 'express';
import sendgrid from '@sendgrid/mail';
import env from './dotenv';

const API_KEY: string = env.SENDGRID_KEY;
sendgrid.setApiKey(API_KEY);
interface From {
    email: string;
    name: string;
}
interface Email {
    to: string;
    from: From;
    subject: string;
    text: string;
    html: string;
}

export function checkUser(req: Request, res: Response, next: NextFunction): void {
    const bearerToken: string = req.get('Authorization');
    console.log(bearerToken);
    next();
}

export async function sendEmail(recieveEmail: string, subject: string, body: string): void {
    const email: Email = {
        to: recieveEmail,
        from: {
            email: 'karmakarfamily216php@gmail.com',
            name: 'Home Access Mail'
        },
        subject,
        text: body,
        html: body
    };
    sendgrid.send(email);
}