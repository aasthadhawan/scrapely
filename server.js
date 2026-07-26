const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const scrapbookRoutes = require("./routes/scrapbookRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(express.static("public"));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");

app.use("/", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/scrapbooks", scrapbookRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});



