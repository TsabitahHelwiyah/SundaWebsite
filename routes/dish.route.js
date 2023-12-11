import express from 'express';
import dishController from '../controllers/dish.controller.js';

const router = express.Router();

router.get('/', dishController.getDishses);
router.get('/:id', dishController.getDish);

export default router;
