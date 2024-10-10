const express = require("express");
const userRouter = require("./routes/userRoutes");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
app.use(cors());

app.use(express.json());
app.use("/user",userRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to CollegeHub");
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(5000,()=>{
        console.log("server started on port "+PORT);
    });
})
.catch((error)=>{
    console.log(error);
});


