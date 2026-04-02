const cookieParser=require('cookie-parser');
const express=require('express');

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const authRoutes=require("./modules/auth/auth.routes");

app.use("/api/v1/auth",authRoutes);


module.exports=app;