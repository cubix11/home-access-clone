"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const monk_1 = __importDefault(require("monk"));
const dotenv_1 = __importDefault(require("./dotenv"));
const db = monk_1.default(dotenv_1.default.MONGO_URI);
exports.users = db.get('users');
