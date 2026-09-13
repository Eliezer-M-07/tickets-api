import express from 'express';
import router from './routes/ticket.routes.js';

const app = express();

app.use(express.json());

app.use('/tickets', router);

export default app;