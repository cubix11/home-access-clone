/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from 'mongoose';
import env from './dotenv';

const MONGO_URI: string = env.MONGO_URI!;
mongoose.connect(MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', () => console.error('Something went wrong'));
db.once('open', (): void => console.log('Connected'));
export default db;