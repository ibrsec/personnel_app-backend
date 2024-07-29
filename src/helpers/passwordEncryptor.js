"use strict";


const crypto = require('node:crypto')

const charLength = 16; // * 2
const secretKey = process.env.SECRET_KEY;
const cryptTime = 10000;
const cryptType = 'sha512';

module.exports =(password) => {
    return crypto.pbkdf2Sync(password,secretKey, cryptTime,charLength,cryptType).toString('hex');
}