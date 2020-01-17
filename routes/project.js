/* eslint-disable no-underscore-dangle */
/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Wednesday, 25th December 2019 2:22:52 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/authenticate');

const ProjectModel = require('../models/project');
const UserModel = require('../models/user');

// const web3 = require('../helpers/web3');
const contractInt = require('../helpers/MainContract');
const signTrans = require('../helpers/signTrans');

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
  '/newProject',
  authenticate,
  awaitHandler(async (req, res) => {
    const user = await UserModel.findOne({ _id: req.user._id });
    if (!user.pan) {
      res.send({ err: 'user details not filled' });
    } else {
      const functionAbi = contractInt.methods
        .proDetails(
          req.body.projectName,
          req.body.projectAmt,
          req.user._id.toString()
        )
        .encodeABI();
      const x = await signTrans(functionAbi);
      const i = await contractInt.methods.proId().call();
      console.log(i);
      const project = new ProjectModel({
        projectId: i,
        projectName: req.body.projectName,
      });
      await project.save();
      res.send({ projectID: i, TransactionDetails: x });
    }
  })
);

router.get(
  '/allProjects',
  awaitHandler(async (req, res) => {
    const x = await contractInt.methods.proId().call();
    console.log(x);
    const projects = [];
    for (let i = 1; i <= x; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      projects.push(await contractInt.methods.mappedPro(i).call());
    }
    res.send({ projects });
  })
);

router.get(
  '/projectInvestors',
  awaitHandler(async (req, res) => {
    const { investors } = await ProjectModel.findOne({
      projectId: req.query.projectId,
    });
    const investorsDetails = [];
    for (let i = 0; i < investors.length; i += 1) {
      investorsDetails.push(
        // eslint-disable-next-line no-await-in-loop
        await contractInt.methods.mappedInv(investors[i]).call()
      );
    }
    res.send({ investorsDetails });
  })
);

module.exports = router;
