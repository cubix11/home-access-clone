"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// TODO: Implement verify email
const express_1 = require("express");
const schema_1 = require("../schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("../dotenv"));
const string_encode_decode_1 = require("string-encode-decode");
const User_1 = __importDefault(require("../models/User"));
const middlewares_1 = require("../middlewares");
const router = express_1.Router();
const url = process.env.NODE_ENV ? '' : 'http://localhost:3000';
function getToken(username, res) {
    console.log(dotenv_1.default.JWT_TIME);
    console.log(Number(dotenv_1.default.JWT_TIME) || dotenv_1.default.JWT_TIME);
    jsonwebtoken_1.default.sign({ username }, dotenv_1.default.SECRET_TOKEN, {
        expiresIn: Number(dotenv_1.default.JWT_TIME) || dotenv_1.default.JWT_TIME
    }, (err, token) => {
        if (err) {
            const error = new Error('Something went wrong :(');
            res.status(500).json({ error: error.message });
        }
        else {
            res.json({ token });
        }
    });
}
router.post('/create', async (req, res) => {
    const user = req.body;
    const valid = schema_1.signupSchema.validate(user); // Check if username and password is valid
    if (valid.error) {
        const error = new Error(valid.error.details[0].message);
        res.status(415).json({ error: error.message });
        return;
    }
    const duplicateUser = await User_1.default.findOne({ username: user.username }); // Check duplicate user
    if (duplicateUser) {
        const error = new Error('Duplicate username');
        res.status(409).json({ error: error.message });
        return;
    }
    const password = user.password;
    const hashedPassword = await bcrypt_1.default.hash(user.password, 15);
    user.password = hashedPassword;
    user.ha_password = string_encode_decode_1.encode(user.ha_password);
    const newUser = new User_1.default({
        username: user.username,
        password: user.password,
        email: string_encode_decode_1.encode(user.email),
        ha_username: string_encode_decode_1.encode(user.ha_username),
        ha_password: user.ha_password,
        verified: false
    });
    newUser.save();
    res.statusCode = 202;
    const html = `<p>Click on the <a href="${url}/user/verify?username=${string_encode_decode_1.encode(user.username)}&password=${string_encode_decode_1.encode(password)}">link</a> to confirm your email`;
    console.log(html);
    middlewares_1.sendEmail(user.email, 'Confirm Email', html);
    getToken(string_encode_decode_1.encode(user.username), res);
});
router.post('/login', async (req, res) => {
    const user = req.body;
    const valid = schema_1.loginSchema.validate(user);
    if (valid.error) {
        const error = new Error(valid.error.details[0].message);
        res.status(415).json({ error: error.message });
        return;
    }
    const userExists = await User_1.default.findOne({ username: user.username });
    if (!userExists) {
        const error = new Error('No username');
        res.status(404).json({ error: error.message });
        return;
    }
    const passwordSame = await bcrypt_1.default.compare(user.password, userExists.password);
    if (passwordSame) {
        res.statusCode = 200;
        getToken(string_encode_decode_1.encode(user.username), res);
    }
    else {
        const error = new Error('Password is incorrect');
        res.status(403).json({ error: error.message });
    }
});
router.delete('/delete', middlewares_1.checkUser, async (req, res) => {
    const username = string_encode_decode_1.decode(req.username);
    const password = req.body.password;
    const user = await User_1.default.findOne({ username });
    if (!user) {
        const error = new Error('No user with that username');
        res.json({ error: error.message });
        return;
    }
    const passwordCorrect = await bcrypt_1.default.compare(password, user.password);
    if (passwordCorrect) {
        res.json({ user: await User_1.default.findOneAndDelete({ username }) });
    }
    else {
        const error = new Error('Password if incorrect');
        res.json({ error: error.message });
    }
});
router.patch('/update', middlewares_1.checkUser, async (req, res) => {
    const updated = req.body;
    const password = updated.password;
    const username = string_encode_decode_1.decode(req.username);
    delete updated.password;
    const user = await User_1.default.findOne({ username });
    if (!user) {
        const error = new Error('No user with that username');
        res.json({ error: error.message });
        return;
    }
    const userPassword = user.password;
    const passCorrect = await bcrypt_1.default.compare(password, userPassword);
    if (passCorrect) {
        const updatedUser = await User_1.default.findOneAndUpdate({ username }, { $set: updated }, { new: true });
        res.json({ user: updatedUser });
    }
    else {
        const error = new Error('Password is incorrect');
        res.json({ error: error.message });
    }
});
router.get('/verify', async (req, res) => {
    let { username, password } = req.query;
    username = string_encode_decode_1.decode(username);
    password = string_encode_decode_1.decode(password);
    console.log(username);
    console.log(password);
    const user = await User_1.default.findOne({ username });
    if (!user) {
        res.send('No user with username');
        return;
    }
    const correctPass = await bcrypt_1.default.compare(password, user.password);
    if (!correctPass) {
        res.send('Incorrect password');
    }
    await User_1.default.updateOne({ username }, { $set: { verified: true } });
    res.send('Congrats, you are verified!');
});
exports.default = router;
