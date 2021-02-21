/* eslint-disable linebreak-style */
import userRoutes from './routes/user';
import express from 'express';
import helmet from 'helmet';
import volleyball from 'volleyball';
import dataRoutes from './routes/data';
import db from './db';
db;
const app: express.Application = express();
const PORT: number | string = process.env.PORT || 3000;
app.use(helmet());
app.use(express.json());
app.use(volleyball);
app.use('/user', userRoutes);
app.use('/data', dataRoutes);
app.listen(PORT, (): void => console.log('Listening on port', PORT));