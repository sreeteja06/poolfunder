/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Tuesday, 24th December 2019 2:11:56 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledContract = require('./build/MainContract.json');
// const { seed } = require('./seed');

const provider = new HDWalletProvider(
  process.env.SEED,
  'https://rinkeby.infura.io/v3/ec2f8b79db3b4da587c4c5299162f65c'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledContract.interface)
  )
    .deploy({ data: compiledContract.bytecode })
    .send({ gas: '10000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();

// Contract deployed to 0xd3bEA157f1FCF20Fc17795E82835F8b73a001C62
