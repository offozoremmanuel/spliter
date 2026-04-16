const requestModel = require('../model/groupRequest');
const groupModel = require('../model/group')

exports.createRequest = async (req,res)=>{
    try {
        const groupId = req.params.id;
        const group = groupModel.findById(groupId);
        if(!group){
            return res.status(400).json({
                message: 'Group not Found'
            })
        }
    } catch (error) {
        
    }
}