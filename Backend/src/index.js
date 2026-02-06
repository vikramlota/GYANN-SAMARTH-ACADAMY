
const dotenv = require('dotenv');
dotenv.config({
    path: './.env'
})
const connectDB = require("./db/index.js");

connectDB();

const {app} = require('./app.js');


  
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(` Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=> {
    console.log("MONGO DB connection failed !!!", err)
})
