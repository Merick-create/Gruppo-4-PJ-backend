import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRouter from './api/route';
import { errorHandlers } from "./error";
import "./lib/auth/auth.handlers"

const app = express();

const allowedOrigins = [
  'http://localhost:4200', // Angular dev server
  'https://gruppo-4-pj-frontend.onrender.com' // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // if you need to send cookies/auth headers
}));

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use('/api', apiRouter);

app.use(errorHandlers);

export default app;