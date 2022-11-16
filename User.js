const mongoose = require('mongoose')

const Users = mongoose.model('User', {
    userName: {type: String, required: true},
    password: {type: String, required: true},
    admin: {type: Boolean},
})

module.exports = Users