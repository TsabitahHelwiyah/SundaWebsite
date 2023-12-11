import prisma from '../database/prisma.js';

const getDishses = async (req, res) => {
	try {
		const dishes = await prisma.dish.findMany();
		if (dishes.length === 0) {
			return res.status(404).json({
				message: 'No dishes found',
			});
		}

		// update image url
		dishes.forEach((dish) => {
			dish.image = `${req.protocol}://${req.get('host')}/${dish.image}`;
		});

		res.status(200).json(dishes);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const getDish = async (req, res) => {
	try {
		const { id } = req.params;

		const food = await prisma.dish.findUnique({
			where: {
				id: Number.parseInt(id, 10),
			},
		});

		if (!food) {
			return res.status(404).json({
				message: 'Dish not found',
			});
		}

		// update image url
		food.image = `${req.protocol}://${req.get('host')}/${food.image}`;

		res.status(200).json(food);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export default {
	getDishses,
	getDish,
};
