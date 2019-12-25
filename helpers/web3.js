/* eslint-disable import/no-mutable-exports */
/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Tuesday, 24th December 2019 2:09:26 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
// const { seed } = require('../contract/seed');

const provider = new HDWalletProvider(
  process.env.SEED,
  `https://rinkeby.infura.io/v3/${process.env.INFURAKEY}`
);
const web3 = new Web3(provider);

module.exports = web3;
