import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.js';
import sessionRouter from './routes/sessions.js';
import indexController from './controllers/indexController.js';
import auth from './middlewares/authMiddleware.js';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

try {
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "arvyax"
    });
} catch (e) {
    console.error('Connection failed:', e);
    process.exit(1);
}

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.PRODUCTION_CLIENT_URL, 
            process.env.LOCAL_CLIENT_URL
        ].filter(Boolean);
        if (!origin) 
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', indexController._health);
app.get('/{*any}', auth._checkUser);
app.use(userRouter);
app.use(sessionRouter);


app.listen(PORT, indexController._msg);