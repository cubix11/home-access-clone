import { Document } from 'mongoose';

interface From {
    email: string;
    name: string;
}
export interface Email {
    to: string;
    from: From;
    subject: string;
    text: string;
    html: string;
}

export interface UserInput {
    username: string;
    password?: string;
    email?: string;
    ha_username: string;
    ha_password: string;
}

export type UserSchema = UserInput & Document;
