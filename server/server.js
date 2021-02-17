"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var routes_1 = __importDefault(require("./routes"));
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var volleyball_1 = __importDefault(require("volleyball"));
var app = express_1.default();
var PORT = process.env.PORT || 3000;
app.use(helmet_1.default());
app.use(express_1.default.json());
app.use(volleyball_1.default);
app.use(routes_1.default);
app.listen(PORT, function () { return console.log('Listening on port', PORT); });
