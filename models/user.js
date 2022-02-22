const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}, 
    userName: {type: String, required: true}, 
    name: {type: String}, 
    img: {type: String}, 
    locations: {type: Number, required: true}
})

module.exports = mongoose.model('User', userSchema)