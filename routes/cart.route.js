import express from 'express';
import cartController from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/', cartController.getCart);
router.get('/clear', cartController.clearCart);
router.get('/checkout', cartController.checkoutCart);
router.get('/add/:id', cartController.addToCart);
router.get('/remove/:id', cartController.removeFromCart);

export default router;
