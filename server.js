require('dotenv').config();
require('./config/database')
require('./model/user')
const express = require('express');
const PORT = process.env.PORT || 7070;

const router = require('./routes/userRouter')
const groupRouter = require('./routes/groupRouter')
const multer = require('multer')

const app = express();
app.use(express.json());
app.use(router);
app.use(groupRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})