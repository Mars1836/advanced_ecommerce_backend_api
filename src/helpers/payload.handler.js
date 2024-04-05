class Payload {
  constructor() {
    this.data = {};
  }
  loadData(object) {
    for (const [key, value] of Object.entries(object)) {
      if (value) {
        this.data[key] = value;
      }
    }
  }
}
module.exports = Payload;
