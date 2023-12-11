import express from 'express';
import reservationController from '../controllers/reservation.controller.js';
import { checkSchema } from 'express-validator';

const router = express.Router();

router.get('/', reservationController.getReservations);
router.get('/:id', reservationController.getReservation);
router.post(
	'/',
	checkSchema({
		name: {
			notEmpty: { errorMessage: 'Name is required' },
			isLength: {
				errorMessage: 'Name must be at least 3 characters long',
				options: { min: 3 },
			},
		},
		email: {
			notEmpty: { errorMessage: 'Email is required' },
			isEmail: { errorMessage: 'Email is invalid' },
		},
		phone: {
			notEmpty: { errorMessage: 'Phone is required' },
			isMobilePhone: {
				options: 'id-ID',
				errorMessage: 'Phone is not a valid Indonesian phone number',
			},
		},
		people: {
			notEmpty: { errorMessage: 'People is required' },
			isInt: {
				errorMessage: 'People must be a number between 1 and 10',
				options: { min: 1, max: 10 },
			},
		},
		time: {
			notEmpty: { errorMessage: 'Time is required' },
			isISO8601: { errorMessage: 'Time is invalid' },
		},
		message: {
			optional: { options: { nullable: true } },
			notEmpty: { errorMessage: 'Message is required' },
		},
	}),
	reservationController.createReservation
);

export default router;
