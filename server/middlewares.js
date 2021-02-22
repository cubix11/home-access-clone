"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVerifyEmail = exports.sendEmail = exports.checkUser = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("./dotenv"));
const User_1 = __importDefault(require("./models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const API_KEY = (process.env.NODE_ENV ? dotenv_1.default.SENDGRID_KEY_PRODUCTION : dotenv_1.default.SENDGRID_KEY_DEVELOPEMENT);
mail_1.default.setApiKey(API_KEY);
function checkUser(req, res, next) {
    const bearerToken = req.get('Authorization');
    let invalid = false;
    if (bearerToken) {
        const token = bearerToken.split(' ')[1];
        console.log(token);
        jsonwebtoken_1.default.verify(token, dotenv_1.default.SECRET_TOKEN, (err, username) => {
            if (err) {
                invalid = true;
            }
            else {
                console.log(username);
                req.username = username.username;
            }
        });
    }
    else {
        invalid = true;
    }
    if (invalid) {
        const error = new Error('Unauthorized');
        res.status(401).json({ error: error.message });
    }
    else {
        next();
    }
}
exports.checkUser = checkUser;
async function sendEmail(recieveEmail, subject, body) {
    const email = {
        to: recieveEmail,
        from: {
            email: 'karmakarfamily216php@gmail.com',
            name: 'Home Access Mail'
        },
        subject,
        text: body,
        html: body
    };
    mail_1.default.send(email);
}
exports.sendEmail = sendEmail;
async function validateVerifyEmail(username, res) {
    const verified = (await User_1.default.findOne({ username })).verified;
    if (!verified) {
        const error = new Error('Your account needs to be verified');
        res.status(403).json({ error: error.message });
        return true;
    }
    return false;
}
exports.validateVerifyEmail = validateVerifyEmail;
