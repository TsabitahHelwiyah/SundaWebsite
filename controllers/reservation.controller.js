import { validationResult } from 'express-validator';
import prisma from '../database/prisma.js';

const getReservations = async (req, res) => {
	try {
		const reservations = await prisma.reservation.findMany();

		if (reservations.length === 0) {
			return res.status(404).json({
				message: 'No reservations found',
			});
		}

		res.status(200).json(reservations);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const getReservation = async (req, res) => {
	try {
		const { id } = req.params;

		const reservation = await prisma.reservation.findUnique({
			where: {
				id: Number.parseInt(id, 10),
			},
		});

		if (!reservation) {
			return res.status(404).json({
				message: 'Reservation not found',
			});
		}

		res.status(200).json(reservation);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const createReservation = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({
				message: 'Failed to create reservation',
				errors: errors.array(),
			});
		}

		const { name, email, phone, people, time, message } = req.body;

		const reservation = await prisma.reservation.create({
			data: {
				name,
				email,
				phone,
				people,
				time,
				message,
			},
		});

		res.status(201).json(reservation);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export default {
	getReservations,
	getReservation,
	createReservation,
};
