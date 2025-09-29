const express = require("express");
const router = express.Router();
router.post("/patch",(req,res)=>res.json({message:"Patch applied"}));
module.exports = router;
