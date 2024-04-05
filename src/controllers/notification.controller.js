const { SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  static async getByUser(req, res, next) {
    console.log("query", req.query);
    const metadata = await NotificationService.getByUser({ ...req.query });
    new SuccessResponse({ message: "Get notification success", metadata }).send(
      res
    );
  }
}
module.exports = NotificationController;
