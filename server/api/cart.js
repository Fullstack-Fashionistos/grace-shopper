const router = require("express").Router();
const {
  models: { Order, Order_Product, Product, User },
} = require("../db");
const { isUser } = require("./utils");
module.exports = router;

router.get("/:id", async (req, res, next) => {
  try {
    const products = await Order.findOne({
      include: [
        {
          model: Order_Product,
          include: Product,
        },
      ],
      where: {
        userId: req.params.id,
        fullfilled: false,
      },
      order: [[Order_Product, "id", "asc"]],
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.post("/", isUser, async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: {
        userId: req.body.userId,
        fullfilled: false,
      },
    });
    const existsInCart = await Order_Product.findOne({
      where: {
        orderId: order.id,
        productId: req.body.productId,
      },
    });
    let newCartItem;
    if (existsInCart) {
      existsInCart.quantity = existsInCart.quantity + Number(req.body.quantity);
      existsInCart.save();
    } else {
      newCartItem = await Order_Product.create({
        quantity: Number(req.body.quantity),
        orderId: order.id,
        productId: req.body.productId,
      });
    }

    res.send(newCartItem || existsInCart);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", isUser, async (req, res, next) => {
  try {
    const product = await Order_Product.findByPk(req.params.id);
    await product.update({ quantity: req.body.quantity });
    res.send(product);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", isUser, async (req, res, next) => {
  try {
    const product = await Order_Product.findByPk(req.params.id);
    await product.destroy();
    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
});
