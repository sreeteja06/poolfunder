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
  '0x027eB28C9121A332BB9E410edc137C8C15aacdc9'
);

module.exports = instance;
