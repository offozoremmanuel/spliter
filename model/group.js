const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    groupname: {
        type: String,
        required: true,
        trim: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    members:[ {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    }],
    contributionAmount: {
        type: String,
        required: true,
        trim: true
    },
    contributionFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
        trim: true
    },
    payoutFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
        trim: true
    },
     describeGroup: {
      type: String,
      required: true,
      trim: true
    },
    totalMembers: {
      type: Number,
      required: true,
      trim: true
    },
});

const groupModel = mongoose.model('groupInfo', groupSchema)

module.exports = groupModel;