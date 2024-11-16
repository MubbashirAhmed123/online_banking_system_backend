const mongoose=require('mongoose')
const dotenv = require('dotenv');

dotenv.config();

const connectToDb= async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,    
        useUnifiedTopology: true
       })
       console.log('db connected')
    } catch (error) {
        console.log('error',error)
        
    }
}

module.exports=connectToDb