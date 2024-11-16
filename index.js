const express=require('express')
const cors=require('cors')
const app=express()
const dotenv = require('dotenv');
const connectToDb = require('./config/db');
const isRegisteredForOnlineTransaction = require('./middleware/auth');

dotenv.config();
app.use(express.json());
const corsConfig = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
  
  app.use(cors(corsConfig))
  app.options("*", cors(corsConfig))
  connectToDb()

app.get('/',(req,res)=>{
    res.send('hello')
})

app.get('/auth',isRegisteredForOnlineTransaction,(req,res)=>{
    
    res.json({ 'message': 'Access granted to secure route.' });

})

app.use('/api/user',require('./routes/userRoutes'))
app.use('/api/user',require('./routes/userRoutes'))


app.use('/api/user',require('./routes/internetBankingRoutes'))


app.listen(process.env.PORT||7000,()=>{
    console.log('server running '+process.env.PORT)
})