require("dotenv").config();

const express = require("express");
const cors = require("cors");

const aiRoutes = require("./ai/ai.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "AlgoPilot AI Backend is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AlgoPilot server running on port ${PORT}`);
});
