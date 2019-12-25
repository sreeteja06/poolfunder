/* eslint-disable consistent-return */
/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Tuesday, 24th December 2019 9:57:01 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    console.log(e);
    res.status(401).send();
  }

  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch(e => {
      console.log(e);
      res.status(401).send();
    });
};

module.exports = { authenticate };
