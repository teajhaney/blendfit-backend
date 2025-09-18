import type { Request, Response } from 'express';
import Cart from '../models/cart.model.ts';
import Order from '../models/order.model.ts';
import { handleError } from '../util/helper.ts';
import { orderSchema } from '../util/validation.ts';
import logger from '../util/logger.ts';

export const createOrder = async (req: Request, res: Response) => {
  logger.info('create order endpoint hit...');
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // 1. Find all cart items for this user
    const cartItems = await Cart.find({ userId }).populate('productId');
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in cart to create an order',
      });
    }

    // 2. Calculate total price and gather product IDs
    let totalPrice = 0;
    const productIds: string[] = [];
    let totalQuantity = 0;

    for (const item of cartItems) {
      const product: any = item.productId;
      if (!product) continue;

      totalPrice += product.price * item.quantity;
      productIds.push(product._id);
      totalQuantity += item.quantity;
    }

    // 3. Get shipping address from body
    const { shippingAddress } = orderSchema.parse(req.body);

    // 4. Create order
    const order = await Order.create({
      userId,
      productId: productIds,
      totalPrice,
      shippingAddress,
      status: 'pending',
      quantity: totalQuantity,
    });


    // 5. Clear user’s cart
    await Cart.deleteMany({ userId });

    logger.info('Order created successfully');
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    handleError(res, error, 'create order');
  }
};
