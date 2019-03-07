/**
 * Created by 毅 on 2016/8/28.
 */

var mongoose = require('mongoose');
var categorySchema = require('../schemas/category');

module.exports = mongoose.model('Category', categorySchema);