/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// TODO: Implement verify email
import { Router, Request, Response } from 'express';
import { loginSchema, signupSchema } from '../schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../dotenv';
import { decode, encode } from 'string-encode-decode';
import User from '../models/User';
import { UpdateType, UserInput } from '../types';
import { checkUser } from '../middlewares';
const router: Router = Router();

function getToken(username: string, res: Response): void {
    jwt.sign(
        { username },
        env.SECRET_TOKEN!,
        {
            expiresIn: parseInt(env.JWT_TIME!)
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

router.post('/create', async (req: Request, res: Response): Promise<void> => {
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
    res.statusCode = 202;
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
    const username: string = req.body.username;
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
    const username = req.username;
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
        User.updateOne({ username }, { $set: updated });
    } else {
        const error: Error = new Error('Password is incorrect');
        res.json({ error: error.message });
    }
});

router.get('/test', checkUser, (req: Request, res: Response): void => {
    res.json({ message: 'Hello World' });
});

export default router;