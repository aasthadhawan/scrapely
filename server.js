const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const scrapbookRoutes = require("./routes/scrapbookRoutes");
const cloudinary = require("./config/cloudinary");


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

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});



