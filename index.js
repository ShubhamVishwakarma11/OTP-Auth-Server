const dotenv = require('dotenv');
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profiles")

// express app
const app = express();
dotenv.config();

// cors
app.use(cors());

//express middleware
app.use(express.json());
app.use( (req,res,next) => {
    console.log(req.path, req.method)
    next()
})


app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);

const port = process.env.PORT

// connect to db
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
    .then( () => {
        // listening for requests
        app.listen(port, () => {
            console.log(`Server started on port ${port} !!!`);
        })
    })
    .catch( (error) => {
        console.log(error);
    })
