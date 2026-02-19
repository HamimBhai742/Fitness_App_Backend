import express from 'express';
import router from './app/routes';
import { startOtpCleaner } from './app/lib/cron';
import { globalErrorHandler } from './app/middleware/globalErrorHandle';

export const app =express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api/v1',router)

startOtpCleaner();
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(globalErrorHandler)