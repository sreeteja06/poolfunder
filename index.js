/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Tuesday, 24th December 2019 3:25:21 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

require('./config/config');

// const web3 = require('./helpers/web3');
const contractInt = require('./helpers/MainContract');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(helmet.xssFilter());
app.use(helmet()); // enable in production
app.disable('x-powered-by');
app.use(morgan(':method :url :status :response-time ms - :remote-addr'));

app.use(require('./routes/user'));
app.use(require('./routes/project'));
app.use(require('./routes/investor'));

app.set('view engine', 'ejs');

const port = process.env.PORT || 1337;

// eslint-disable-next-line no-unused-vars
const awaitHandler = fn => {
  return async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      await fn(req, res, next);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
};

app.get(
  '/',
  awaitHandler(async (req, res) => {
    // const account = await web3.eth.getAccounts();
    // const x = contractInt.options.jsonInterface;
    const x = await contractInt.methods.owner().call();
    console.log(x);
    res.send({ x });
  })
);

app.listen(port, () => {
  console.log(`Started up at port http://localhost:${port}/`);
});
