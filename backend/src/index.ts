import 'reflect-metadata';
import { createServer } from 'http';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gruppo4';

mongoose.set('debug', true);
mongoose.connect(MONGO_URI)
    .then(_ => {
        const port = process.env.PORT || 3000;
        createServer(app).listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch(err => {
        console.error(err);
    })