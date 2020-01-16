/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Tuesday, 24th December 2019 2:17:23 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const web3 = require('./web3');
const abi = require('./abi.json');

const instance = new web3.eth.Contract(
  abi,
  '0x19f98D7e669e70B07Be0DE9F712B09B069cA6369'
);

module.exports = instance;
