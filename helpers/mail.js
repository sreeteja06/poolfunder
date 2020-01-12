/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Tuesday, 24th December 2019 11:10:11 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const nodemailer = require('nodemailer');

const sendMail = (subject, mailBody, mailID, html = null) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL,
    // you can try with TLS, but port is then 587
    auth: {
      user: 'woodbolly501@gmail.com', // Your email id
      pass: process.env.EMAILPASS, // Your password
    },
  });
  let mailOptions;
  if (!html) {
    mailOptions = {
      from: 'Pool Funder <woodbolly501@gmail.com>',
      to: mailID,
      subject,
      text: mailBody,
    };
  } else {
    console.log('sending html');
    mailOptions = {
      from: 'Pool funder <woodbolly501@gmail.com>',
      to: mailID,
      subject,
      html: mailBody,
    };
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = sendMail;
