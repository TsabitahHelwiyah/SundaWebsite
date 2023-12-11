import prisma from '../database/prisma.js';

const getOrders = async (req, res) => {
	try {
		const orders = await prisma.order.findMany({
			include: {
				items: {
					include: {
						dish: true,
					},
				},
			},
		});

		if (orders.length === 0) {
			return res.status(404).json({
				message: 'No orders found',
			});
		}

		// calculate total for each order
		orders.forEach((order) => {
			order.total = order.items.reduce((acc, item) => {
				return acc + item.dish.price * item.quantity;
			}, 0);
		});

		// calculate count of each order
		orders.forEach((order) => {
			order.count = order.items.reduce((acc, item) => {
				return acc + item.quantity;
			}, 0);
		});

		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const getOrder = async (req, res) => {
	try {
		const { id } = req.params;

		const order = await prisma.order.findUnique({
			where: {
				id: Number.parseInt(id, 10),
			},
			include: {
				items: {
					include: {
						dish: true,
					},
				},
			},
		});

		if (!order) {
			return res.status(404).json({
				message: 'Order not found',
			});
		}

		// calculate total
		order.total = order.items.reduce((acc, item) => {
			return acc + item.dish.price * item.quantity;
		}, 0);

		// calculate count of each order
		order.count = order.items.reduce((acc, item) => {
			return acc + item.quantity;
		}, 0);

		// update image url
		order.items.forEach((item) => {
			item.dish.image = `${req.protocol}://${req.get('host')}/${item.dish.image}`;
		});

		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export default {
	getOrders,
	getOrder,
};
