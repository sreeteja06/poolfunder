/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Wednesday, 25th December 2019 4:25:49 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/authenticate');

const InvestorModel = require('../models/investor');
const ProjectModel = require('../models/project');

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
  '/registerInvestor',
  authenticate,
  awaitHandler(async (req, res) => {
    const functionAbi = contractInt.methods
      .invDetail(req.body.phone, req.body.email, req.user._id.toString())
      .encodeABI();
    const x = await signTrans(functionAbi);
    const i = await contractInt.methods.invId().call();
    const investor = new InvestorModel({
      contractInvestorId: i,
      investorId: req.user._id,
    });
    await investor.save();
    res.send(x);
  })
);

router.get(
  '/allInvestors',
  authenticate,
  awaitHandler(async (req, res) => {
    const x = await contractInt.methods.invId().call();
    console.log(x);
    const investors = [];
    for (let i = 1; i <= x; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      investors.push(await contractInt.methods.mappedInv(i).call());
    }
    res.send({ investors });
  })
);

router.get(
  '/investorsInvestments',
  authenticate,
  awaitHandler(async (req, res) => {
    const { investedIn, contractInvestorId } = await InvestorModel.findOne({
      investorId: req.user._id,
    });
    const projectDetails = [];
    for (let i = 0; i < investedIn.length; i += 1) {
      projectDetails.push({
        project: await contractInt.methods.mappedPro(investedIn[i]).call(),
        invested: await contractInt.methods
          .investRecord(contractInvestorId, investedIn[i])
          .call(),
        share: await contractInt.methods
          .getShareAndConv(contractInvestorId, investedIn[i])
          .call(),
      });
    }
    res.send({ projectDetails });
  })
);

router.post(
  '/investInProject',
  authenticate,
  awaitHandler(async (req, res) => {
    const { contractInvestorId } = await InvestorModel.findOne({
      investorId: req.user._id,
    });
    const functionAbi = contractInt.methods
      .invest(
        contractInvestorId,
        req.body.projectID,
        req.user._id.toString(),
        req.body.investAmt
      )
      .encodeABI();
    const x = await signTrans(functionAbi);
    await InvestorModel.findOneAndUpdate(
      { investorId: req.user._id },
      { $push: { investedIn: req.body.projectID } }
    );
    await ProjectModel.findOneAndUpdate(
      { projectId: req.body.projectID },
      { $push: { investors: contractInvestorId } }
    );
    res.send(x);
  })
);

router.post(
  '/withdrawInvestment',
  authenticate,
  awaitHandler(async (req, res) => {
    res.send();
  })
);

module.exports = router;
