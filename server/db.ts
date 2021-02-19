import monk from 'monk';
import env from './dotenv';
const db = monk(env.MONGO_URI);
export const users = db.get('users');