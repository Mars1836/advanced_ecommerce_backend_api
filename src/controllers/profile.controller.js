const { SuccessResponse } = require("../core/success.response");

const profiles = [
  {
    id: 1,
    name: "John",
    avatar: "https://example.com/avatar1.jpg",
    age: 30,
  },
  {
    id: 2,
    name: "Alice",
    avatar: "https://example.com/avatar2.jpg",
    age: 25,
  },
  {
    id: 3,
    name: "Bob",
    avatar: "https://example.com/avatar3.jpg",
    age: 35,
  },
  // Add more profiles as needed
];
class ProfileController {
  static async profiles(req, res, next) {
    new SuccessResponse({
      message: "view all profiles",
      metadata: profiles,
    }).send(res);
  }
  static async profile(req, res, next) {
    new SuccessResponse({
      message: "view own profile",
      metadata: profiles[1],
    }).send(res);
  }
}
module.exports = ProfileController;
