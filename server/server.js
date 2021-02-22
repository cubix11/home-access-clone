"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable linebreak-style */
const user_1 = __importDefault(require("./routes/user")); // Import the user routes
const express_1 = __importDefault(require("express")); // Import express to make a web server
const helmet_1 = __importDefault(require("helmet")); // Import helmet used for basic security
const volleyball_1 = __importDefault(require("volleyball")); // Import volleyball for a logger for the server
const db_1 = __importDefault(require("./db")); // Import database file. This file creates the database connection (MongoDB using mLab)
db_1.default; // This just makes sure the database file is run
const app = express_1.default(); // Create application
const PORT = process.env.PORT || 3000; // Define port
app.use(helmet_1.default()); // Use helmet
app.use(express_1.default.json()); // Use Express JSON to accept JSON responses
app.use(volleyball_1.default); // Use volleyball
app.use('/user', user_1.default); // Use user routes
app.listen(PORT, () => console.log('Listening on port', PORT)); // Tell application to listen on the PORT variable
