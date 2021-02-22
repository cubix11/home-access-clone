/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response, NextFunction } from 'express';
import sendgrid from '@sendgrid/mail';
import env from './dotenv';
import { Email } from './types';
import User from './models/User';
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

const API_KEY: string = (process.env.NODE_ENV ? env.SENDGRID_KEY_PRODUCTION : env.SENDGRID_KEY_DEVELOPEMENT)!;
sendgrid.setApiKey(API_KEY);

export function checkUser(req: Request, res: Response, next: NextFunction): void {
    const bearerToken: string | undefined = req.get('Authorization');
    let invalid = false;
    if(bearerToken) {
        const token: string = bearerToken.split(' ')[1];
        console.log(token);
        jwt.verify(token, env.SECRET_TOKEN!, (err: JsonWebTokenError | NotBeforeError | TokenExpiredError | null, username: object | undefined): void => {
            if(err) {
                invalid = true;
            } else {
                console.log(username);
                req.username = username!.username;
            }
        });
    } else {
        invalid = true;
    }
    if(invalid) {
        const error: Error = new Error('Unauthorized');
        res.status(401).json({ error: error.message });
    } else {
        next();
    }
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

export async function validateVerifyEmail(username: string, res: Response): Promise<boolean> {
    const verified: boolean = (await User.findOne({ username }))!.verified;
    if(!verified) {
        const error: Error = new Error('Your account needs to be verified');
        res.status(403).json({ error: error.message });
        return true;
    }
    return false;
}