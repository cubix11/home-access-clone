/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Router, Request, Response } from 'express';
import { loginSchema, signupSchema } from '../schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../dotenv';
import { encode } from 'string-encode-decode';
import User from '../models/User';
import { UserInput } from '../types';
const router: Router = Router();

function getToken(user: UserInput, res: Response): void {
    console.log(user);
    jwt.sign(
        user,
        env.SECRET_TOKEN!,
        {
            expiresIn: parseInt(env.JWT_TIME!)
        },
        (err: Error | null, token: string | undefined) => {
            if(err) {
                const error: Error = new Error('Something went wrong :(');
                res.status(500).json({ error: error.message });
            }
            res.json({ token });
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
    const newUser = new User(user);
    newUser.save();
    user.ha_password = encode(user.ha_password);
    delete user.password;
    delete user.email;
    getToken(user, res);
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
    user.ha_password = encode(user.ha_password);
    if (passwordSame) {
        getToken(user, res);
    } else {
        res.json({ error: 'Password is incorrect' });
    }
});

export default router;