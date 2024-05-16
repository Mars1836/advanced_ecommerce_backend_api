const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  static async checkout(req, res, next) {
    //USER
    const { shopOrderIds } = req.body;
    const metadata = await CheckoutService.checkoutReview(
      { userId: req.user.ob.id },
      {
        shopOrderIds,
      }
    );
    new SuccessResponse({
      message: "Update quantity product in cart success",
      metadata,
    }).send(res);
  }
}
module.exports = CheckoutController;
