"use strict";
const { Token } = require("../models/tokenModel");
const { Personnel } = require("../models/personnelModel");
const { mongoose } = require("../config/dbConnection");

module.exports.token = {
  list: async (req, res) => {
    /*
        #swagger.ignore = true
    */

    const tokens = await res.getModelList(Token);
    res.status(200).json({
      error: false,
      message: "Tokens are listed!",
      details: await res.getModelListDetails(Token),
      result: tokens,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.ignore = true
    */
    const { userId, token } = req.body;
    if (!userId || !token) {
      res.errorStatusCode = 400;
      throw new Error("Token and user id are required!");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.errorStatusCode = 400;
        throw new Error("Invalid id type!");
      }

    const userAvaliable = await Personnel.findOne({_id:userId})
    if(!userAvaliable){
        res.errorStatusCode = 404;
        throw new Error('User not found for creating token!');
    }


    const newToken = await Token.create({ userId,token });

    res.status(201).json({
      error: false,
      message: "New Token is created!",
      result: newToken,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.ignore = true
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }
    const token = await Token.findOne({ _id: req.params?.id });
    if (!token) {
      res.errorStatusCode = 404;

      throw new Error("Token not Found!");
    }
    res.status(200).json({
      error: false,
      message: "Your Token is here!",
      result: token,
    });
  },

  update: async (req, res) => {
    /*
        #swagger.ignore = true
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }

    
    const { userId , token } = req.body;
    if (!userId || !token) {
      res.errorStatusCode = 400;
      throw new Error("userId , token are required for update!");
    }


    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.errorStatusCode = 400;
        throw new Error("Invalid id type!");
      }
      

    const userAvaliable = await Personnel.findOne({_id:userId})
    if(!userAvaliable){
        res.errorStatusCode = 404;
        throw new Error('User not found for creating token!');
    }


    const tokenData = await Token.findOne({ _id: req.params?.id });
    if (!tokenData) {
      res.errorStatusCode = 404;
      throw new Error("Token not Found!");
    }

    const { modifiedCount } = await Token.updateOne(
      { _id: req.params?.id },
      { userId , token },
      { runValidators: true }
    );

    if (modifiedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error(
        "Something went wrong! - token is exist but could't update! - Issue at the last step!"
      );
    }

    res.status(202).json({
      error: false,
      message: "Token is updated!!",
      result: await Token.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
        #swagger.ignore = true
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }

    const token = await Token.findOne({ _id: req.params?.id });
    if (!token) {
      res.errorStatusCode = 404;
      throw new Error("Token not Found!");
    }

    const { deletedCount } = await Token.deleteOne({ _id: req.params?.id });

    if (deletedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error(
        "Something went wrong! - token is exist but could't delete! - Issue at the last step!"
      );
    }

    res.sendStatus(204);
  },
};
