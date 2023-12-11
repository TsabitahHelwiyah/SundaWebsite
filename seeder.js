const dishes = [
	{
		name: 'Empal Gepuk',
		description: 'Daging empal yang dimasak dengan bumbu manis. Nikmat disajikan dengan nasi hangat dan sambal',
		price: 23000,
		image: 'images/menu-img-1.jpg',
	},
	{
		name: 'Mie Kocok',
		description:
			'Sajian mie kikil yang segar, dilengkapi dengan mie, tauge, kikil, dan taburan bawang goreng dan daun bawang.',
		price: 28000,
		image: 'images/menu-img-2.jpg',
	},
	{
		name: 'Nasi Timbel',
		description: 'Nasi bakar teri, tempe, tahu, ayam/ikan, lengkuas, dan sambel.',
		price: 28000,
		image: 'images/menu-img-3.jpg',
	},
	{
		name: 'Paket Nasi Liwet',
		description:
			'Olahan nasi khas sunda dengan sajian tradisional, lezat gurih pulen, ditambah dengan gurihnya ayam goreng.',
		price: 30000,
		image: 'images/menu-img-4.jpg',
	},
	{
		name: 'Es Pala',
		description:
			'Minuman ini terbuat dari buah pala yang di iris tipis-tipis, kemudian di siram menggunakan larutan gula dan es batu',
		price: 18000,
		image: 'images/menu-img-5.jpg',
	},
	{
		name: 'Bajigur',
		description:
			'Minuman khas sunda yang cocok untuk menghangatkan badan Anda. Terdiri dari wedang jahe, kayu manis, gula merah dan rempah-rempah.',
		price: 15000,
		image: 'images/menu-img-6.jpg',
	},
	{
		name: 'Es Cincau',
		description:
			'Es cincau terbuat dari sari tumbuhan yang memiliki banyak serat dan kandungan gizi tinggi. Disajukan dengan es batu, santan, dan gula cair.',
		price: 15000,
		image: 'images/menu-img-7.jpg',
	},
	{
		name: 'Es Jeniper',
		description:
			'Minuman yang menggunakan jeruk nipis sebagai bahan dasar, juga memiliki khasiat yang brsama dengan jeruk nipis.',
		price: 10000,
		image: 'images/menu-img-8.jpg',
	},
];

import prisma from './database/prisma.js';

const seed = async () => {
	try {
		await prisma.dish.createMany({
			data: dishes,
		});

		console.log('Seed success');
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

(async () => {
	await seed();
})();
