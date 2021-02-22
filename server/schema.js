"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// These validate the input being passed in
exports.signupSchema = joi_1.default.object().keys({
    username: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_-]*$)/).min(2).max(30).required(),
    password: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_!@#$%^&*()-="',.<>/?:`~]*$)/).min(2).max(30).required(),
    email: joi_1.default.string().trim().email().required(),
    ha_username: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_!@#$%^&*()-="',.<>/?:`~]*$)/).min(2).max(30).required(),
    ha_password: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_!@#$%^&*()-="',.<>/?:`~]*$)/).min(2).max(30).required()
});
exports.loginSchema = joi_1.default.object().keys({
    username: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_-]*$)/).min(2).max(30).required(),
    password: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_!@#$%^&*()-="',.<>/?:`~]*$)/).min(2).max(30).required()
});
