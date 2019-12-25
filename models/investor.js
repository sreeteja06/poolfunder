/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Wednesday, 25th December 2019 2:46:51 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  contractInvestorId: {
    type: Number,
    required: true,
    unique: true,
  },
  investedIn: [],
});

module.exports = mongoose.model('Investor', InvestorSchema);
