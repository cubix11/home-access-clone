/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response, NextFunction } from 'express';
import sendgrid from '@sendgrid/mail';
import env from './dotenv';
import { Email } from './types';

const API_KEY: string = env.SENDGRID_KEY!;
sendgrid.setApiKey(API_KEY);

export function checkUser(req: Request, res: Response, next: NextFunction): void {
    const bearerToken: string | undefined = req.get('Authorization');
    console.log(bearerToken);
    next();
}

export async function sendEmail(recieveEmail: string, subject: string, body: string): Promise<void> {
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