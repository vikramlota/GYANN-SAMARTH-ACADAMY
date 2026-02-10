require('dotenv').config({ path: './.env' });
const connectDB = require('./db/index.js');
const { app } = require('./app.js');
const serverless = require('serverless-http');


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(` Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=> {
    console.log("MONGO DB connection failed !!!", err)
})
