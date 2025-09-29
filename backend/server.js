const express = require("express");
const app = express();
app.use(express.json());
app.get("/", (req,res)=>res.send("Scrape the Plate Full v4 Backend"));
app.listen(5000,()=>console.log("Backend running on 5000"));
