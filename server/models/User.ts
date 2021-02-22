import mongoose, { Schema } from 'mongoose';
import { UserSchema } from '../types';

const User: Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ha_username: {
        type: String,
        required: true
    },
    ha_password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    }
});

const model = mongoose.model<UserSchema>('User', User, 'users');
export default model;