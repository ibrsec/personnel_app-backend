"use strict";

const { Token } = require("../models/tokenModel");
const { Personnel } = require("../models/personnelModel");
const passwordEncryptor = require("../helpers/passwordEncryptor");

module.exports.auth = {
  login: async (req, res) => {
    /**
             #swagger.tags = ['Authentication'],
             #swagger.summary = Login with credentials
             #swagger.description = `Login with valid username and password!
                                        
                                <li><b>Password length should be 4 to 16</b></li> 
            </br></br><b>Permission: 'No Permission'</b>`
             #swagger.parameters['body] = {
              in:'body',
              required:true,
              schema: {
                  username:'*String',
                  password:'*String',
              }
             }
     */
    const { username, password } = req.body;
    //check payload is ok
    if (!username || !password) {
      res.errorStatusCode = 400;
      throw new Error("Username and password is required to login!");
    }

    //check user is exist
    const user = await Personnel.findOne({ username });
    if (!user) {
      res.errorStatusCode = 401;
      throw new Error("Unauthorized - User not found!!");
    }

    //check password
    if (user.password !== passwordEncryptor(password)) {
      res.errorStatusCode = 401;
      throw new Error("Unauthorized - Invalid Password!!");
    }

    //check if the user is a active user
    if (!user.isActive) {
      res.errorStatusCode = 401;
      throw new Error("Unauthorized - his user is not active!!");
    }

    //if token is not exist create one
    let tokenData = await Token.findOne({ userId: user._id });
    if (!tokenData) {
      tokenData = await Token.create({
        userId: user._id,
        token: passwordEncryptor(`${user.userId}-${Date.now()}`),
      });
    }

    console.log(tokenData);

    //send a successfull login response with token and user
    res.status(200).json({
      error: false,
      token: tokenData.token,
      user,
    });
  },
  current: async (req, res) => {
     /**
             #swagger.tags = ['Authentication'],
             #swagger.summary = Get current user 
             #swagger.description = `If user provide a valid token -> user id will be returned!!
            </br></br><b>Permission: 'No Permission'</b>`
             
     */
             
    res.status(200).json({
      error: false,
      message: "message from current ",
      token: req.token,
      userId: req.user,
    });
  },
  logout: async (req, res) => {
    /**
             #swagger.tags = ['Authentication'],
             #swagger.summary = Logout with token or without token!
             #swagger.description = `If user provide a valid token, it will be deleted, but if user doesn't just user will logout!! 
            </br></br><b>Permission: 'No Permission'</b>`
             
     */
    const deleteData = await Token.deleteOne({userId:req.user?._id});

    // res.userId = null;
    // res.token = null;
    res.status(200).json({
      error: false,
      message: "Logout is OK!",
      deletedToken:deleteData?.deletedCount,
    });
  },
};
