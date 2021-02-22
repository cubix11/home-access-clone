"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("./dotenv"));
const MONGO_URI = dotenv_1.default.MONGO_URI;
mongoose_1.default.connect(MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose_1.default.connection;
db.on('error', () => console.error('Something went wrong'));
db.once('open', () => console.log('Connected'));
exports.default = db;
