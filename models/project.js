/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Wednesday, 25th December 2019 2:44:30 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: {
    type: Number,
    required: true,
    unique: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  investors: [],
});

module.exports = mongoose.model('project', ProjectSchema);
