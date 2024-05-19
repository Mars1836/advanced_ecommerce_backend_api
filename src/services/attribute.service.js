const { ErrorResponse } = require("../core/error.response");
const { attrModel, attrItemModel } = require("../models/attribute.model");
const { delUnValueField } = require("../utils");
class AttrService {
  static async getAllDetailAttr({ name, id }) {
    const query = { name, id };
    delUnValueField(query);
    const attr = await attrModel
      .find(query)
      .select({
        _id: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      })
      .lean();
    const list = await Promise.all(
      attr.map(async (attr) => {
        const attrItems = await attrItemModel
          .find({ attrId: attr.id })
          .select({
            _id: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
          })
          .lean();
        return {
          ...attr,
          attrItems,
        };
      })
    );
    return list;
  }
  static async removeAttItem({ id }) {
    const query = { id };
    const rs = await attrItemModel.deleteMany({ id });
    return rs;
  }
  static async removeManyAttItems({ ids: [] }) {
    const rs = await attrItemModel.deleteMany({ id: ids });
    return rs;
  }
  static async updateOne({ id, name, description }) {
    const update = { name, description };
    delUnValueField(update);
    const options = { new: true, upsert: true };
    const attr = await attrModel.findOneAndUpdate(
      { id },
      { name, description, att_items },
      options
    );
    return attr;
  }
  static async removeById(id) {
    const attr = await attrModel.deleteOne({ id });
    const attrItems = await attrItemModel.deleteMany({ attrId: id });
    return { attr, attrItems };
  }
  static async create({ name, description, form }) {
    console.log(form);
    const attr = await attrModel.create({ name, description, form });
    return attr;
  }
  static async createItem({ attrId, name, description, spec }) {
    const attr = await attrModel.findOne({ id: attrId });

    if (!attr) {
      throw new ErrorResponse("Attribute provide does not exist.");
    }
    const form = attr?.form;
    const validArr = checkValidate(form, spec);
    const indexUnvalid = validArr.indexOf(false);
    if (indexUnvalid !== -1) {
      throw new ErrorResponse(
        `Field ${form[indexUnvalid].key} must have ${form[indexUnvalid].type} value`
      );
    }
    const attrItem = await attrItemModel.create({
      attrId,
      name,
      description,
      spec,
    });
    return attrItem;
  }
}
function checkValidate(form, ob) {
  return form.map((item) => {
    const value = ob[item?.key];
    if (!value && item?.required) {
      return false;
    }
    if (value && typeof value !== item?.type.toLowerCase()) {
      return false;
    }
    return true;
  });
}

module.exports = AttrService;
