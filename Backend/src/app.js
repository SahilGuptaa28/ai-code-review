const express = require('express');
const aiRoutes = require('./ai.routes');
const cors = require('cors');

const app = express();

app.use(express.json());

// ✅ Correct CORS setup
app.use(cors({
  origin: "https://ai-code-review-pearl.vercel.app",  // frontend domain
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Important: handle preflight requests
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/ai", aiRoutes);

module.exports = app;
