import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/users.js';
import sessionRouter from './routes/sessions.js';

const app = express();
dotenv.config();

try {
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "arvyax"
    });
} catch (e) {
    console.error('Connection failed:', e);
    process.exit(1);
}


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRouter);
app.use(sessionRouter);

app.get('/', (req, res) => {
    console.log('Server is Live!');
    res.send("Hello World");
    res.end();
});

app.listen(5000, () => {
    console.log("App live at http://127.0.0.1:5000");
});