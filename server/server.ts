/* eslint-disable linebreak-style */
import userRoutes from './routes/user'; // Import the user routes
import express from 'express'; // Import express to make a web server
import helmet from 'helmet'; // Import helmet used for basic security
import volleyball from 'volleyball'; // Import volleyball for a logger for the server
import db from './db'; // Import database file. This file creates the database connection (MongoDB using mLab)
db; // This just makes sure the database file is run
const app: express.Application = express(); // Create application
const PORT: number | string = process.env.PORT || 3000; // Define port
app.use(helmet()); // Use helmet
app.use(express.json()); // Use Express JSON to accept JSON responses
app.use(volleyball); // Use volleyball
app.use('/user', userRoutes); // Use user routes
app.listen(PORT, (): void => console.log('Listening on port', PORT)); // Tell application to listen on the PORT variable