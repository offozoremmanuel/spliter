require('dotenv').config();
require('./config/database')
require('./model/user')
const expressSession = require('express-session')
const express = require('express');
const {passport} = require('./middleware/passport')
const PORT = process.env.PORT || 7070;

const router = require('./routes/userRouter')
const groupRouter = require('./routes/groupRouter');


const app = express();
app.use(express.json());
app.use(expressSession({
    secret: 'emmanuel',
    resave: true,
    saveUninitialized: true
}))
app.use (passport.initialize())
app.use (passport.session())
app.use(router);
app.use(groupRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})