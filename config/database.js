const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://offozoremmy_db_user:MVq2Ta2j5zFeo4Hj@cluster0.alsrrwd.mongodb.net/').then(()=>{
    console.log('Database connected sucessfully');
    
}).catch((error)=>{
    console.log('Unable to connect:', error.message);
    
})