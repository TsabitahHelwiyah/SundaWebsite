import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const origins = ['http://127.0.0.1:5500', 'http://localhost:5500'];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (origins.indexOf(origin) === -1) {
				const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		credentials: true,
	})
);

import main from './routes/index.route.js';
import dishes from './routes/dish.route.js';
import orders from './routes/order.route.js';
import carts from './routes/cart.route.js';
import reservations from './routes/reservation.route.js';

app.use('/api/v1', main);
app.use('/api/v1/dishes', dishes);
app.use('/api/v1/orders', orders);
app.use('/api/v1/carts', carts);
app.use('/api/v1/reservations', reservations);

app.use('*', (req, res) => {
	res.status(404).json({
		message: 'Route not found',
	});
});

export default app;
