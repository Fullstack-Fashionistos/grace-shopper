const router = require("express").Router();
const {
  models: { Order, Order_Product, Product, User },
} = require("../db");
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
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// router.put("/:id", async (req, res, next) => {
//   try {
//     const item = await Cart.findByPk()
//   } catch {

//   }
// });
