const swagger = require('swagger-jsdoc');
const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title: "splita",
            version:" 1.0.0",
            description:" swager documentation"
        },
        servers:[
            {
                url:"http://localhost:7078",
                description:" documentation"
            }
        ],
         components:{
        securitySchemes:{
            bearerAuth:{
                type:"http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
     }
       
    },
     apis:[
       "./docs/user.yaml","./docs/group.yaml",

        ],
}
module.exports = swagger(options)