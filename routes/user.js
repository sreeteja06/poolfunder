/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Tuesday, 24th December 2019 10:11:00 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const express = require('express');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('../db/mongoose');

const User = require('../models/user');
const mailer = require('../helpers/mail');
const { authenticate } = require('../middleware/authenticate');
require('../config/config');
const investorModel = require('../models/investor');

const awaitHandler = fn => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

router.post(
  '/register',
  awaitHandler(async (req, res) => {
    const OTP = Math.floor(Math.random() * 100000);
    const tempUser = await User.findOne({ email: req.body.email });
    if (tempUser && tempUser.verified) {
      res.status(403).send({ res: 'user already registered' });
    } else {
      if (tempUser && !tempUser.verified) {
        await User.deleteOne({ email: req.body.email });
      }
      const body = {
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        pan: req.body.pan,
        memberType: req.body.memberType,
        address: req.body.address,
        OTP,
      };
      const user = new User(body);
      user
        .save()
        .then(() => {
          console.log(`OTP: ${OTP}`);
          mailer(
            'OTP for Pool Funder',
            `OTP generation: ${OTP} is your otp for registering on Pool Funder.`,
            req.body.email
          );
          res.send({ response: `${user.email}registerd, check mail for OTP` });
        })
        .catch(e => {
          res.status(400).send(e);
        });
    }
  })
);

router.post(
  '/users/verify',
  awaitHandler(async (req, res) => {
    const tempUser = await User.findOne({ email: req.body.email });
    if (!tempUser) {
      res.status(203).send({ err: 'email not found' });
    } else if (tempUser.OTP != req.body.OTP) {
      res.status(203).send({ err: 'otp not correct' });
    } else {
      await User.findOneAndUpdate(
        { email: req.body.email },
        { verified: true }
      );
      res.send({ response: 'user successfully verified' });
    }
  })
);

router.post(
  '/users/login',
  awaitHandler(async (req, res) => {
    const tempUser = await User.findOne({ email: req.body.email });
    if (tempUser && !tempUser.verified) {
      res.status(403).send({ res: 'user not verified' });
    } else {
      const body = {
        email: req.body.email,
        password: req.body.password,
      };

      User.findByCredentials(body.email, body.password)
        .then(user => {
          return user.generateAuthToken().then(async token => {
            const tempInv = await investorModel.findOne({
              investorId: user._id,
            });
            let investor = false;
            if (tempInv) {
              investor = true;
            }
            res.header('x-auth', token).send({
              response: `${user.email} succesfully logged in`,
              token: user.tokens,
              investor,
            });
          });
        })
        .catch(e => {
          console.log(e);
          res.status(400).send();
        });
    }
  })
);

router.get(
  '/users/me',
  authenticate,
  awaitHandler((req, res) => {
    res.send(req.user);
  })
);

router.delete(
  '/users/logout',
  authenticate,
  awaitHandler((req, res) => {
    req.user.removeToken(req.token).then(
      () => {
        res.status(200).send();
      },
      () => {
        res.status(400).send();
      }
    );
  })
);

module.exports = router;
