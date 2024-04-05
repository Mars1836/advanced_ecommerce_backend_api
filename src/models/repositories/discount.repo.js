const {
  handleIdToObjectId,
  getSelectData,
  getUnSelectData,
} = require("../../utils");
const discountModel = require("../discount.model");
class DiscountRepo {
  static findAllByQuery = async (
    query,
    { page = 1, sort, skip = 0, limit = 100, select, unSelect }
  ) => {
    query = handleIdToObjectId(query);
    skip = (page - 1) * limit;
    const defaultOps = {
      sort: {
        updateAt: -1,
      },
      skip: 0,
      limit: 100,
      select: getSelectData([
        "name",
        "description",
        "type",
        "value",
        "code",
        "startDate",
        "endDate",
        "minOrderValue",
        "shopId",
      ]),
    };
    return await discountModel
      .find(query)
      .sort(sort ? { ...defaultOps.sort, ...sort } : defaultOps.sort)
      .skip(+skip || defaultOps.skip)
      .limit(+limit || defaultOps.limit)
      .select(
        getUnSelectData(unSelect) || getSelectData(select) || defaultOps.select
      )
      .lean();
  };

  // check discount is valid
}
module.exports = DiscountRepo;
