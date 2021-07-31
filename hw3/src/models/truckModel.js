const mongoose = require('mongoose');

const Truck = mongoose.model('Truck', {
    
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    
    assigned_to : String,

    status: {
        type: String,
        enum: ['OL', 'IS'],
        default: 'IS'
    },

    type: {
        type: String,
        required: true,
        enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT']
    },

    created_date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = { Truck };
