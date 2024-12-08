 const express = require('express');
 const dotEnv = require('dotenv');
 const mongoose = require('mongoose');
 const app = express();
 const vendoRoute = require('./routes/vendoRoute');
 const bodyParse = require('body-parser');
 const firmRoute = require('./routes/firmRoute');
 const productRoute = require('./routes/productRoute');
 const path = require('path');

 const PORT = process.env.PORT || 3000;
 
 dotEnv.config();
 mongoose.connect(process.env.MONGO_URL)
 .then(()=>console.log("MongoDb connected succesfully")).catch((error)=> console.log(error))

 app.use(bodyParse.json());
 
 app.use('/vendor',vendoRoute);
 app.use('/firm',firmRoute);
 app.use('/product',productRoute);
 app.use('/uploads',express.static('uploads'));

 app.listen(PORT,()=>{
    console.log("server is running");
 })

 app.use('/',(req,res)=>{
      res.send("Hello World");
 });