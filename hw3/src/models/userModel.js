const mongoose = require('mongoose');

const User = mongoose.model('User', {

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
        enum: ['SHIPPER', 'DRIVER']
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = { User };
