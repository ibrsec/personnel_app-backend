"use strict";
const {Token} = require('../models/tokenModel')
const {Personnel} = require('../models/personnelModel')




module.exports = async (req, res, next) => {
  res.user = null;

  const authHeader =  req.headers.authorization || req.headers.Authorization || null;
  console.log("authHeader", authHeader);
  if (authHeader && authHeader.startsWith("Token")) {
    const token = authHeader.split(" ")[1];
    const tokenData = await Token.findOne({token}).populate('userId');
    if(tokenData){
        req.user= tokenData?.userId;
        req.token= tokenData?.token;
    }





  }
  next();
};
