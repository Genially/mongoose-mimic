'use strict';

const mongoose = require('mongoose');

/**
 * Generates a random ObjectId
 */
module.exports = () => mongoose.Types.ObjectId().toString();
