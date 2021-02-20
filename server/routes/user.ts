import { Router, Request, Response } from 'express';
import { loginSchema, signupSchema } from '../schema';
import { users } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../dotenv';
import { decode, encode } from 'string-encode-decode';
const router: Router = Router();
interface User {
    username: string;
    password: string;
    ha_username: string;
    ha_password: string;
}

function getToken(user: User, res: Response): void {
    jwt.sign(
        user,
        env.SECRET_TOKEN,
        {
            expiresIn: parseInt(env.JWT_TIME)
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
    const user: User = req.body;
    const valid = signupSchema.validate(user); // Check if username and password is valid
    if(valid.error) {
        const error: Error = new Error(valid.error.details[0].message);
        res.status(415).json({ error: error.message });
        return;
    }
    const duplicateUser = await users.findOne({ username: user.username }); // Check duplicate user
    if(duplicateUser) {
        const error: Error = new Error('Duplicate username');
        res.status(409).json({ error: error.message });
        return;
    }
    const hashedPassword = await bcrypt.hash(user.password, 15);
    user.password = hashedPassword;
    const newUser = await users.insert(user);
    user.ha_password = encode(user.ha_password);
    getToken(newUser, res);
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const user: User = req.body;
    const valid = loginSchema.validate(user);
    if(valid.error) {
        const error: Error = new Error(valid.error.details[0].message);
        res.status(415).json({ error: error.message });
        return;
    }
    const userExists: User = await users.findOne({ username: user.username });
    if(!userExists) {
        const error: Error = new Error('No username');
        res.status(404).json({ error: error.message });
        return;
    }
    const password = userExists.password;
    const passwordSame = await bcrypt.compare(user.password, password);
    user.ha_password = encode(user.ha_password);
    if (passwordSame) {
        getToken(user, res);
    } else {
        res.json({ error: 'Password is incorrect' });
    }
});

export default router;