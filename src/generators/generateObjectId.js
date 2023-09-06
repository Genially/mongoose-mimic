const mongoose = require('mongoose');

/**
 * Generates a random ObjectId
 */
module.exports = () => new mongoose.Types.ObjectId().toString();
