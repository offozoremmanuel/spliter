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