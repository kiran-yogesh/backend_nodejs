const { default: mongoose } = require("mongoose");

const firmschema = new mongoose.Schema({
    firmname:{
        type:String,
        require:true,
        unique:true,
        
    },
    area:{
        type:String,
        require:true
    },
    category:{
        type:[
            {
                type:String,
                enum:['veg','Non-veg']
            }
        ]
    },
    region:{
        type:[
            {
                type:String,
                enum:['North-indian','South-indian','Chinese','Bakery']
            }
        ]
    },
    offer:{
        type:String
    },
    image:{
        type:String
    },
    vendor:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'vendors'
        }
    ],
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Products'
        }
    ]
});
const Firm = mongoose.model('Firm',firmschema);
module.exports=Firm;
