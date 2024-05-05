const { SuccessResponse } = require("../core/success.response");
const logger = require("../loggers/winston");
const KeyService = require("../services/key.service");
const NotificationService = require("../services/notification.service");

class KeyController {
  static async create(req, res, next) {
    const { key, permissions } = req.body;
    const metadata = await KeyService.create({ key, permissions });

    new SuccessResponse({ message: "Create key success", metadata }).send(res);
  }
}
module.exports = KeyController;
