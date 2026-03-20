require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/summarize", async (req, res) => {
  const text = req.body.text;

  if (!text) {
    return res.status(400).json({ error: "Text required" });
  }

  try {
    // 👇 ADD HERE
    console.log("HF KEY:", process.env.HF_API_KEY);

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data[0].summary_text;

    res.json({
      summary,
      keyPoints: [
        "Auto-generated summary",
        "Uses NLP model",
        "Powered by HuggingFace"
      ],
      sentiment: "neutral"
    });

  } catch (err) {
    console.log("===== ERROR START =====");
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log("Message:", err.message);
    console.log("===== ERROR END =====");

    res.status(500).json({ error: "Failed to summarize" });
  }
});
