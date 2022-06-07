const  mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        minLength: 6,
        maxLength: 30
    },
    email: {
        type: String,
        require: true,
        unique: true,
        minLength: 12,
        maxLength: 50
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    admin: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);