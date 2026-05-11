const jwt = require('jsonwebtoken')

const checkLogin = async(req, res, next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        if(!token){
            return res.status(401).json({
                message: 'Token not found'
            })
        }
        
        const validToken = await jwt.verify(token, process.env.SECRET_KEY)
        req.user = validToken
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        }) 
    }
}
const adminAuth = async(req, res, next)=>{
    try {
        if(req.user.role !== 'admin'){
            return res.status(403).json({
                message: 'Unauthorized: Admins only'
            })
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports ={
     checkLogin,
     adminAuth
}