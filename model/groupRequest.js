const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'groupInfo'
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    groupName: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending','Accepted','Rejected'],
        default: 'pending'
    },
    userInfo: {
        type: String,
        required: true
    }
})
const GroupRequestModel = mongoose.model('GroupRequest', requestSchema);

module.exports = GroupRequestModel;