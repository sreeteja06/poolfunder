/* eslint-disable func-names */
/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Wednesday, 25th December 2019 3:02:50 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const EthereumTx = require('ethereumjs-tx');

const web3 = require('./web3');

const instantiateContract = async functionAbi => {
  web3.eth.defaultAccount = '0x4c1e9d26Ec8311f48Bc03662eE8108Bd23Edcb30';
  const pk = process.env.PK; // private key of your account
  const address = '0x202dd2052a6c7484bd14b67331c82b31728f1021'; // Contract Address
  const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount);
  console.log('nonce value is ', nonce);
  // const contract = new web3.eth.Contract(abi, address, {
  //   from: web3.eth.defaultAccount,
  //   gas: 3000000,
  // });
  // const functionAbi = contract.methods.proDetails('ab', 1, 'b').encodeABI();
  const details = {
    nonce,
    gasPrice: web3.utils.toHex(web3.utils.toWei('50', 'gwei')),
    gas: 300000,
    to: address,
    value: 0,
    data: functionAbi,
  };
  const transaction = new EthereumTx(details);
  transaction.sign(Buffer.from(pk, 'hex'));
  const rawData = `0x${transaction.serialize().toString('hex')}`;
  return web3.eth.sendSignedTransaction(rawData);
};

module.exports = instantiateContract;
