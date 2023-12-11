import prisma from '../database/prisma.js';

const getCart = async (req, res) => {
	try {
		const cart = await prisma.cart.findFirst({
			include: {
				items: {
					include: {
						dish: true,
					},
				},
			},
		});

		if (!cart) {
			const newCart = await prisma.cart.create({
				data: {
					items: {
						create: [],
					},
				},
			});

			return res.status(200).json(newCart);
		}

		cart.items.forEach((item) => {
			item.dish.image = `${req.protocol}://${req.get('host')}/${item.dish.image}`;
		});

		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const addToCart = async (req, res) => {
	try {
		const { id: dishId } = req.params;

		const dish = await prisma.dish.findUnique({
			where: {
				id: Number.parseInt(dishId, 10),
			},
		});

		if (!dish) {
			return res.status(404).json({
				message: 'Dish not found',
			});
		}

		const cart = await prisma.cart.findFirst({
			include: {
				items: {
					include: {
						dish: true,
					},
				},
			},
		});

		if (!cart) {
			await prisma.cart.create({
				data: {
					items: {
						create: [
							{
								dishId: dish.id,
								quantity: 1,
							},
						],
					},
				},
			});

			return res.status(200).json({
				message: 'Dish added to cart',
			});
		}

		const orderItem = await prisma.orderItem.findFirst({
			where: {
				dishId: dish.id,
				cartId: cart.id,
			},
		});

		if (!orderItem) {
			await prisma.orderItem.create({
				data: {
					dishId: dish.id,
					cartId: cart.id,
					quantity: 1,
				},
			});

			return res.status(200).json({
				message: 'Dish added to cart',
			});
		}

		await prisma.orderItem.update({
			where: {
				id: orderItem.id,
			},
			data: {
				quantity: orderItem.quantity + 1,
			},
		});

		res.status(200).json({
			message: 'Dish quantity updated',
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const removeFromCart = async (req, res) => {
	try {
		const { id: dishId } = req.params;

		const dish = await prisma.dish.findUnique({
			where: {
				id: Number.parseInt(dishId, 10),
			},
		});

		if (!dish) {
			return res.status(404).json({
				message: 'Dish not found',
			});
		}

		const cart = await prisma.cart.findFirst({
			include: {
				items: {
					include: {
						dish: true,
					},
				},
			},
		});

		if (!cart) {
			await prisma.cart.create({
				data: {
					items: {
						create: [],
					},
				},
			});

			return res.status(200).json({
				message: 'Cart is empty',
			});
		}

		const orderItem = await prisma.orderItem.findFirst({
			where: {
				dishId: dish.id,
				cartId: cart.id,
			},
		});

		if (!orderItem) {
			return res.status(404).json({
				message: 'Dish not found in cart',
			});
		}

		if (orderItem.quantity === 1) {
			await prisma.orderItem.delete({
				where: {
					id: orderItem.id,
				},
			});

			return res.status(200).json({
				message: 'Dish removed from cart',
			});
		}

		await prisma.orderItem.update({
			where: {
				id: orderItem.id,
			},
			data: {
				quantity: orderItem.quantity - 1,
			},
		});

		res.status(200).json({
			message: 'Dish quantity updated',
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const clearCart = async (req, res) => {
	try {
		const cart = await prisma.cart.findFirst({
			include: {
				items: {
					include: {
						dish: true,
					},
				},
			},
		});

		if (!cart) {
			await prisma.cart.create({
				data: {
					items: {
						create: [],
					},
				},
			});

			return res.status(200).json({
				message: 'Cart is already empty',
			});
		}

		if (cart.items.length === 0 || cart.items === null) {
			return res.status(404).json({
				message: 'Cart is empty',
			});
		}

		await prisma.orderItem.deleteMany({
			where: {
				cartId: cart.id,
			},
		});

		res.status(200).json({
			message: 'Cart cleared',
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const checkoutCart = async (req, res) => {
	try {
		const cart = await prisma.cart.findFirst({
			include: {
				items: {
					include: {
						dish: true,
					},
				},
			},
		});

		if (!cart) {
			await prisma.cart.create({
				data: {
					items: {
						create: [],
					},
				},
			});

			return res.status(200).json({
				message: 'Cart is empty',
			});
		}

		if (cart.items.length === 0 || cart.items === null) {
			return res.status(404).json({
				message: 'Cart is empty',
			});
		}

		const order = await prisma.order.create({
			data: {
				items: {
					create: cart.items.map((item) => ({
						dishId: item.dish.id,
						quantity: item.quantity,
					})),
				},
			},
		});

		await prisma.orderItem.deleteMany({
			where: {
				cartId: cart.id,
			},
		});

		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export default {
	getCart,
	addToCart,
	removeFromCart,
	clearCart,
	checkoutCart,
};
