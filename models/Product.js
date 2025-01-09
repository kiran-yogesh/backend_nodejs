const mongoose = require('mongoose');
const Productschema = new mongoose.Schema({
    productname:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    },
    category:{
        type:[{
            type:String,
            enum:['veg','non-veg']
        }]
    },
    image:{
        type:String
    },
    bestseller:{
        type:Boolean
    },
    description:{
        type:String
    },
    firm:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Firm'
        }
    ]
})
const products = mongoose.model('products',Productschema);

module.exports=products;