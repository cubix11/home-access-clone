"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.checkUser = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("./dotenv"));
const API_KEY = dotenv_1.default.SENDGRID_KEY;
mail_1.default.setApiKey(API_KEY);
function checkUser(req, res, next) {
    const bearerToken = req.get('Authorization');
    console.log(bearerToken);
    next();
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
