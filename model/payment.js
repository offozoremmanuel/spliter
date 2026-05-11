const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groupInfo',
    },
    amount: {
        type: Number,
        required: true,
    },
    reference: {
        type: String,
        required: true,
        unique: true,
    },
        groupName: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status:{
        type: String ,
        enum:[ 'processing', 'success', 'failed','abandon'],
        default:"processing"        
    },

},{timestamps: true});

const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = paymentModel;