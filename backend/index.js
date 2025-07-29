import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import router from './auth/auth.js';

const app = express();
dotenv.config();

try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Mongo is live!');
} catch (e) {
    console.error('Connection failed:', e);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.get('/', (req, res) => {
    console.log('Server is Live!');
    res.send("Hello World");
    res.end();
});

app.listen(5000, () => {
    console.log("App live at http://127.0.0.1:5000");
});