const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://oshiobughieailakhu_db_user:iOiIuik5YZSHgvOn@cluster0.vajd8jb.mongodb.net/').then(()=>{
    console.log('Database is connected');
    
}).catch((error)=>{
    console.log('Unable to connect:', error.message);
    
})