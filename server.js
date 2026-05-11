require('dotenv').config();
require('./model/user')
const swaggerUi = require('swagger-ui-express')
const expressSession = require('express-session')
const express = require('express');
const {passport} = require('./middleware/passport')
const PORT = process.env.PORT || 7070;
const swagger = require('./documentation')
const userRouter = require('./routes/userRouter')
const groupRouter = require('./routes/groupRouter');
const paymentRouter = require('./routes/payment')
const requestRouter = require('./routes/request')


const app = express();
app.use(express.json());
app.use(expressSession({
    secret: 'emmanuel',
    resave: true,
    saveUninitialized: true
}))
app.use (passport.initialize())
app.use (passport.session())

app.use('/apisDocs',swaggerUi.serve,swaggerUi.setup(swagger))

app.use('/api/v1/user',userRouter);
app.use('/api/v1/group',groupRouter)
app.use('/api/v1/payment',paymentRouter)
app.use('/api/v1/request',requestRouter)

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    })
})

app.use((err, req, res,next) => {
    if(err.name === 'TokenExpiredError'){
        return res.status(401).json({
            message: 'session expired: please login to continue'
        })
     }
     if(err,name === 'MulterError'){
        return res.status(400).json({
            message: err.message
        })
     }
    console.log(err.message)
    res.status(500).json({
        message: 'something went wrong'
     })
})

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI ).then(()=>{
    console.log('Database connected sucessfully');
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
}).catch((error)=>{
    console.log('Unable to connect:', error.message);
    
})
