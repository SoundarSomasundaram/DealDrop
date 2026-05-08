require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { runPriceCheckLogic } = require("./controllers/cronController");

const productRoutes = require("./routes/productRoutes");
const cronRoutes = require("./routes/cronRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/cron", cronRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Schedule the price check to run automatically every hour
  // Syntax: minute hour dayOfMonth month dayOfWeek
  // "0 * * * *" means at minute 0 of every hour
  cron.schedule("0 * * * *", async () => {
    console.log("[CRON] Running scheduled price check...");
    try {
      await runPriceCheckLogic();
      console.log("[CRON] Scheduled price check completed.");
    } catch (error) {
      console.error("[CRON] Scheduled price check failed:", error);
    }
  });

  console.log("[CRON] Scheduled background job to check prices every hour.");
});
