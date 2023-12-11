import express from 'express';
import orderController from '../controllers/order.controller.js';

const router = express.Router();

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);

export default router;
