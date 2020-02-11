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
  '0xe72c51038B9b3b846Cdb58f3F111B4Fd77b63351'
);

module.exports = instance;
