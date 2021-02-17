import router from './routes';
import express from 'express';
import helmet from 'helmet';
import volleyball from 'volleyball';
const app: express.Application = express();
const PORT: number | string = process.env.PORT || 3000;
app.use(helmet());
app.use(express.json());
app.use(volleyball)
app.use(router)
app.listen(PORT, (): void => console.log('Listening on port', PORT));