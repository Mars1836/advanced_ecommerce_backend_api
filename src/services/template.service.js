const templateModel = require("../models/template.model");

class TemplateService {
  static async findByName({ name }) {
    const template = await templateModel.findOne({ name });
  }
  static async create({ name, html }) {
    const template = await templateModel.create({
      name,
      html,
    });
    return template;
  }
}
module.exports = TemplateService;
