/**
 *
 * Created by paranoidyang on 2019/3/5
 */

var mongoose = require('mongoose')

/*用户的表结构*/
module.exports = new mongoose.Schema({
  username: String,
  password: String
})