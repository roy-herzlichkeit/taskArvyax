import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.js';
import sessionRouter from './routes/sessions.js';
import indexController from './controllers/indexController.js';
import auth from './middlewares/authMiddleware.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

try {
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "arvyax"
    });
} catch (e) {
    console.error('Connection failed:', e);
    process.exit(1);
}

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', indexController._health);
app.get('/{*any}', auth._checkUser);
app.use(userRouter);
app.use(sessionRouter);


app.listen(PORT, indexController._msg);