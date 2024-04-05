const _ = require("lodash");
const { default: mongoose } = require("mongoose");
//select fields of object  to show
const getInforData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
// change ["a","b","c"...] to {a:1, b:1, c:1 ...}
const getSelectData = (arr) => {
  ob = arr.reduce((acc, cur) => {
    acc[cur] = 1;
    return acc;
  }, {});
  return ob;
};
// change ["a","b","c"...] to {a:0, b:0, c:0 ...}
const getUnSelectData = (arr) => {
  ob = arr?.reduce((acc, cur) => {
    acc[cur] = 0;
    return acc;
  }, {});
  return ob;
};
// change {id : value,...} to {_id: ObjectId(value)}
const handleIdToObjectId = (query) => {
  if (query?.id) {
    query._id = new mongoose.Types.ObjectId(query.id);
    delete query.id;
    return query;
  }
  if (query?._id) {
    query._id = new mongoose.Types.ObjectId(query._id);
    return query;
  }
  return query;
};
function checkValidOb(ob) {
  return typeof ob === "object" && !Array.isArray(ob) && ob !== null;
}
// partially substitute value of key an object // the max of recursion loop is 10
function partialUpdate(data, update, n = 0) {
  Object.keys(update).forEach((item) => {
    if (checkValidOb(update[item]) && checkValidOb(data[item]) && n < 10) {
      partialUpdate(data[item], update[item], n++);
    } else {
      data[item] = update[item];
    }
  });
}
//delete field that have null or underfind value in an object // the max of recursion loop is 10
function filterNoValueField(ob, n = 0) {
  if (checkValidOb(ob)) {
    Object.keys(ob).forEach((item) => {
      if (checkValidOb(ob[item]) && n < 10) {
        filterNoValueField(ob[item], n++);
      }
      if (ob[item] === null || ob[item] === undefined) {
        delete ob[item];
      }
    });
  }
}
//check if an array is contained in another array
function arrayContain(carray, parray) {
  console.log(carray, carray);
  const a = carray.every((item) => {
    return parray.includes(item);
  });
  console.log(a);
  return a;
}
function countFrequencyEle(array, element) {
  count = 0;
  for (const e of array) {
    if (e === element) {
      count++;
    }
  }
  return count;
}
function generateTrackNumber() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const trackNumberLength = 10;
  let trackNumber = "";

  for (let i = 0; i < trackNumberLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    trackNumber += characters.charAt(randomIndex);
  }

  return trackNumber;
}

const utils = {
  getInforData,
  handleIdToObjectId,
  getSelectData,
  getUnSelectData,
  checkValidOb,
  partialUpdate,
  filterNoValueField,
  arrayContain,
  countFrequencyEle,
  generateTrackNumber,
};
module.exports = utils;
