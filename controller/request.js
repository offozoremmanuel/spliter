const GroupRequestModel = require('../model/groupRequest');
const groupModel = require('../model/group')
const userModel = require('../model/user')

exports.createRequest = async (req, res) =>{
    try {
        const userId = req.user.id;
        const {groupId} = req.body;
        const group = await groupModel.findById(groupId)
        if(!group){
            return res.status(404).json({
                message: 'Group not found'
            })
        }
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const request = new GroupRequestModel({
            userId: userId,
            groupId,
            groupName: group.groupname,
            userInfo: user.fullname
        })
        await request.save()
        res.status(201).json({
            message: 'Request created successfully',
            data: request
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

exports.acceptRequest = async (req,res)=>{
    try {
        const groupId = req.params.id;
        const {requestId} = req.params;
        const request = await GroupRequestModel.findById(requestId)
        if(!request){
            return res.status(404).json({
                message: 'Request not found'
            })
        }
        if(request.status === 'accepted' || request.status === 'rejected'){
            return res.status(400).json({
                message: 'Request not accepted'
            })
        }
        const group = await groupModel.findById(request.groupId);
        if(!group){
            return res.status(404).json({
                message: 'Group not found'
            })
        }

        if(group.createdBy.toString() !== adminId){
            return res.status(403).json({
                message: 'unauthorized: not an admin'
            })
        }
        group.members.push(request.userId)
        request.status = 'accepted'
        await group.save()
        await request.save()
        res.status(200).json({
            message: 'Request accepted successfully',
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "something went wrong"
        })

    }
}
exports.AllrequestsForAdmin = async (req, res) =>{
    try {
        const {id} = req.params;
        const {groupId} = req.params;
        const group = await groupModel.findById(groupId);
        if(!group){
            return res.status(404).json({
                message: 'Group not found'
            })
        }
        if(group.createdBy.toString() !== id){
            return res.status(403).json({
                message: 'unauthorized: not an admin'
            })
        }   
        const requests = await GroupRequestModel.find({groupId});
        res.status(200).json({
            message: 'Requests retrieved successfully',
            data: requests
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "something went wrong"
        })
    }
}
exports.rejectRequest = async (req, res) =>{
    try {
        const adminId = req.user.id;
        const {requestId} = req.params;
        const request = await GroupRequestModel.findById(requestId)
        if(!request){
            return res.status(404).json({
                message: 'Request not found'
            })
        }

        if(request.status === 'accepted' || request.status === 'rejected'){
            return res.status(400).json({
                message: 'Request not accepted'
            })
        }
        const group = await groupModel.findById(request.groupId);
        if(!group){
            return res.status(404).json({
                message: 'Group not found'
            })
        }
        if(group.createdBy.toString() !== adminId){
            return res.status(403).json({
                message: 'unauthorized: not an admin'
            })
        }
        request.status = 'rejected'
        await request.save()
        res.status(200).json({
            message: 'Request rejected successfully',
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "something went wrong"
        })
    }
}
