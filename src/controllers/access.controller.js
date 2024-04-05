"use strict";

const {
  CreateRequestSuccess,
  SuccessResponse,
} = require("../core/success.response");
const AccessService = require("../services/access.service");
const ApikeyService = require("../services/apikey.service");

class AccessController {
  handleAccessTokenV2 = async (req, res, next) => {
    const infor = await AccessService.handleAccessTokenV2({
      keyStore: req.keyStore,
      user: req.user,
      refreshToken: req.refreshToken,
    });
    new SuccessResponse({ message: "Get token success", metadata: infor }).send(
      res
    );
  };
  handleAccessToken = async (req, res, next) => {
    const infor = await AccessService.handleAccessToken(req.body);
    new SuccessResponse({ message: "Get token success", metadata: infor }).send(
      res
    );
  };
  logout = async (req, res, next) => {
    const delKey = await AccessService.logout(req.keyStore);
    new SuccessResponse({ metadata: delKey, message: "Logout success!" }).send(
      res
    );
  };
  signIn = async (req, res, next) => {
    const re = await AccessService.signIn(req.body);
    new SuccessResponse({ metadata: re, message: "Login success" }).send(res);
  };
  signUp = async (req, res, next) => {
    const ob = await AccessService.signUp(req.body);
    new CreateRequestSuccess({ options: { limit: 10 }, metadata: ob }).send(
      res
    );
  };
  signUp1 = async (req, res, next) => {
    try {
      const storedKey = await ApikeyService.create();
      return res.status(200).json(storedKey);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
module.exports = new AccessController();
