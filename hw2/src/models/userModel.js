const mongoose = require('mongoose');

const User = mongoose.model('User', {
    username: String,
    password: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = { User };
