"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable linebreak-style */
const user_1 = __importDefault(require("./routes/user"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const volleyball_1 = __importDefault(require("volleyball"));
const data_1 = __importDefault(require("./routes/data"));
const db_1 = __importDefault(require("./db"));
db_1.default;
const app = express_1.default();
const PORT = process.env.PORT || 3000;
app.use(helmet_1.default());
app.use(express_1.default.json());
app.use(volleyball_1.default);
app.use('/user', user_1.default);
app.use('/data', data_1.default);
app.listen(PORT, () => console.log('Listening on port', PORT));
