require ("dotenv").config();
const express = require("express");
const app = express();
require ("./db/conn.js");
const cors = require("cors");
const router = require("./Routes/router")
const PORT = process.env.PORT || 6010


app.use(cors());
app.use(express.json());
app.use("/uploads",express.static("./uploads"));
app.use(router);
app.use("/files",express.static("./public/files"));

app.listen(PORT,()=>{
    console.log(`Server Started at port no ${PORT}`);
})