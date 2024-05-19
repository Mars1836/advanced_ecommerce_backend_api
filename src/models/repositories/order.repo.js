const { getSelectData } = require("../../utils");
const orderModel = require("../order.model");

class OrderRepo {
  static findAllByQuery = async (
    query,
    { page = 1, sort, skip = 0, limit = 100, select = [], unSelect = [] }
  ) => {
    skip = (page - 1) * limit;
    const defaultOps = {
      sort: {
        updateAt: -1,
      },
      skip: 0,
      limit: 100,
      select: getSelectData([
        "userId",
        "shiping",
        "checkout",
        "trackingNumber",
        "status",
        "products",
      ]),
    };
    let selectOp = defaultOps.select;
    if (unSelect.length > 0) {
      selectOp = getUnSelectData(unSelect);
    } else if (select.length > 0) {
      selectOp = getSelectData(select);
    }
    return await orderModel
      .find(query)
      .sort(sort ? { ...defaultOps.sort, ...sort } : defaultOps.sort)
      .skip(+skip || defaultOps.skip)
      .limit(+limit || defaultOps.limit)
      .select(selectOp)
      .lean();
  };
}
module.exports = OrderRepo;
