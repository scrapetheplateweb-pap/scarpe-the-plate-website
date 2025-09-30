const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:5001/chat", {
      message: req.body.message
    });
    res.json(response.data);
  } catch (error) {
    console.error("Chatbot proxy error:", error.message);
    res.status(500).json({ text: "Chatbot service unavailable" });
  }
});

module.exports = router;
