/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Router, Request, Response } from 'express';
import { loginSchema, signupSchema } from '../schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../dotenv';
import { decode, encode } from 'string-encode-decode';
import User from '../models/User';
import { UpdateType, UserInput } from '../types';
import { checkUser, sendEmail, validateVerifyEmail } from '../middlewares';
const JWT_TIME: number | string = '1h';
const router: Router = Router();
const url = process.env.NODE_ENV ? '' : 'http://localhost:3000';

function getToken(username: string, res: Response): void {
    jwt.sign(
        { username },
        env.SECRET_TOKEN!,
        {
            expiresIn: Number(JWT_TIME) || JWT_TIME
        },
        (err: Error | null, token: string | undefined) => {
            if(err) {
                const error: Error = new Error('Something went wrong :(');
                res.status(500).json({ error: error.message });
            } else {
                res.json({ token });
            }
        }
    );
}

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    const user: UserInput = req.body;
    const valid = signupSchema.validate(user); // Check if username and password is valid
    if(valid.error) {
        const error: Error = new Error(valid.error.details[0].message);
        res.status(415).json({ error: error.message });
        return;
    }
    const duplicateUser = await User.findOne({ username: user.username }); // Check duplicate user
    if(duplicateUser) {
        const error: Error = new Error('Duplicate username');
        res.status(409).json({ error: error.message });
        return;
    }
    const password = user.password;
    const hashedPassword = await bcrypt.hash(user.password, 15);
    user.password = hashedPassword;
    user.ha_password = encode(user.ha_password);
    const newUser = new User({
        username: user.username,
        password: user.password,
        email: encode(user.email),
        ha_username: encode(user.ha_username),
        ha_password: user.ha_password,
        verified: false
    });
    newUser.save();
    res.statusCode = 201;
    const html = `<p>Click on the <a href="${url}/user/verify?username=${encode(user.username)}&password=${encode(password)}">link</a> to confirm your email`;
    sendEmail(user.email!, 'Confirm Email', html);
    getToken(encode(user.username), res);
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const user: UserInput = req.body;
    const valid = loginSchema.validate(user);
    if(valid.error) {
        const error: Error = new Error(valid.error.details[0].message);
        res.status(415).json({ error: error.message });
        return;
    }
    const userExists = await User.findOne({ username: user.username });
    if(!userExists) {
        const error: Error = new Error('No username');
        res.status(404).json({ error: error.message });
        return;
    }
    const passwordSame = await bcrypt.compare(user.password, userExists.password!);
    if (passwordSame) {
        res.statusCode = 200;
        getToken(encode(user.username), res);
    } else {
        const error: Error = new Error('Password is incorrect');
        res.status(403).json({ error: error.message });
    }
});

router.delete('/delete', checkUser, async (req: Request, res: Response): Promise<void> => {
    const username: string = decode(req.username);
    const password: string = req.body.password;
    const user = await User.findOne({ username });
    if(!user) {
        const error: Error = new Error('No user with that username');
        res.json({ error: error.message });
        return;
    }
    const passwordCorrect = await bcrypt.compare(password, user.password!);
    if(passwordCorrect) {
        res.json({ user: await User.findOneAndDelete({ username }) });
    } else {
        const error: Error = new Error('Password if incorrect');
        res.json({ error: error.message });
    }
});

router.patch('/update', checkUser, async (req: Request, res: Response): Promise<void> => {
    const updated: UpdateType = req.body;
    const password = updated.password;
    let username: string = decode(req.username);
    delete updated.password;
    const user = await User.findOne({ username });
    if(!user) {
        const error: Error = new Error('No user with that username');
        res.json({ error: error.message });
        return;
    }
    const userPassword: string | undefined = user.password;
    const passCorrect: boolean = await bcrypt.compare(password, userPassword!);
    if(passCorrect) {
        // This always does first!!!
        if(!(JSON.stringify(Object.keys(updated)) === JSON.stringify(['email']))) {
            if(await validateVerifyEmail(username, res)) return;
        }
        if('newPassword' in updated) {
            const hashedPassword: string = await bcrypt.hash(updated.newPassword, 15);
            delete updated.newPassword;
            updated.password = hashedPassword;
        }
        if('username' in updated) {
            const existingUser = await User.findOne({ username: updated.username });
            console.log(existingUser);
            if(username === updated.username) {
                const error: Error = new Error('You are attempting to change your username to the same one as before');
                res.json({ error: error.message });
                return;
            }
            if(existingUser) {
                const error: Error = new Error('Username already taken');
                res.status(409).json({ error: error.message });
                return;
            }
            await User.updateOne({ username }, { $set: { username: updated.username } });
            username = updated.username!;
            delete updated.username;
        }
        Object.keys(updated).map((key: string): void => { updated[key] = encode(updated[key]); });
        const updatedUser = await User.findOneAndUpdate({ username }, { $set: updated }, { new: true });
        res.json({ user: updatedUser });
    } else {
        const error: Error = new Error('Password is incorrect');
        res.json({ error: error.message });
    }
});

router.get('/verify', async (req: Request, res: Response): Promise<void> => {
    let { username, password } = req.query;
    username = decode(username);
    password = decode(password);
    const user = await User.findOne({ username });
    if(!user) {
        res.send('No user with username');
        return;
    }
    const correctPass: boolean = await bcrypt.compare(password, user.password!);
    if(!correctPass) {
        res.send('Incorrect password');
    }
    await User.updateOne({ username }, { $set: { verified: true } });
    res.send('Congrats, you are verified!');
});

export default router;