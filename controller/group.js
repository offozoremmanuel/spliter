const groupModel = require('../model/group')


exports.createGroup = async(req, res)=>{
    try {
        const {groupname, contributionAmount, contributionFrequency, payoutFrequency, describeGroup, totalMembers} = req.body
        
        const newGroup = new groupModel({
            groupname,
            contributionAmount, 
            contributionFrequency, 
            payoutFrequency, 
            describeGroup, 
            totalMembers,
            createdBy: req.user.id
        })
        const min = 2
        const max = 12
        if (totalMembers >= max){
            return res.status(404).json({
                message: "maximum number exceeded, members must be less than 12"
            })
        }else if (totalMembers < min){
            return res.status(404).json({
                message: "minimum number not reached, number must be greater than 2 "
            })
        }
        newGroup.members.push(req.user.id)

        await newGroup.save()
        res.status(201).json({
            message: "Group created successfully",
            data: newGroup
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "something went wrong"
        })
    }
}
exports.getAll = async (req, res) =>{
    try {
        const groups = await groupModel.find().populate('members' ,'fullname')    
        res.status(200).json({
            message: "Groups retrieved successfully",
            data: groups
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({  
            message: "something went wrong"
        })
    }
}

exports.getOneGroup = async (req, res) =>{
    try {
        const {id} = req.params
        const group = await groupModel.findById(id).populate('members', 'fullname email phoneNumber')
        if (!group){
            return res.status(404).json({
                message: "Group not found"
            })
        }
        res.status(200).json({
            message: "Group found",
            data: group
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "something went wrong"
        })
    }

}
exports.removeMenberfromGroup = async (req, res) =>{
    try {
        const {id} = req.user;
        const {groupId , memberId} = req.params
        const group = await groupModel.findById(groupId)
        if(!group){
            return res.status(404).json({
                message: "Group not found"
            })
        }
        if(group.createdBy.toString() !== id){
            return res.status(403).json({
                message: "Unauthorized: Only group admin can remove members"
            })
        }
        if(createdBy.toString() === memberId){
            return res.status(403).json({
                message: "Unauthorized: Admin cannot remove themselves from the group"
            })
        }
        const memberIndex = group.members.findIndex(member => member.toString() === memberId)
        if(memberIndex === -1){
            return res.status(404).json({
                message: "Member not found in the group"
            })
        }
        group.members.splice(memberIndex, 1)
        await group.save()
        res.status(200).json({
            message: "Member removed from the group"
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "something went wrong"
        })
    }

}