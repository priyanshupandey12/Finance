const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authSchema = new mongoose.Schema({

})


const Auth = mongoose.model('Auth', authSchema);


module.exports = Auth;