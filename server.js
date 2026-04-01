require('dotenv').config();
const connectDB=require('./src/comman/config/db.config');
const app=require('./src/app');


const startServer=async()=>{
    await connectDB()
   app.listen(process.env.PORT,()=>{
      console.log(`Server is running on port ${process.env.PORT}`);
   })
}

startServer().catch((err)=>{
    console.error('Failed to start server:', err);
    process.exit(1);
});
