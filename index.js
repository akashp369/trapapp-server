const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();

const port = process.env.PORT || 5000;
//routes imports
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const categoriesRoutes = require('./routes/categoryRoutes')
//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());

//route middlewares
app.use("/api/admin", adminRoutes)
app.use('/api/user', userRoutes);
app.use('/api/categories', categoriesRoutes);

//server test route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Trap app server is running" })

})
//connection to database
connectDB(process.env.MONGO_URI);

//server listenng 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

