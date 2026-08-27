const express = require("express");
const path = require("path");
const { ensureDB } = require("./src/db");
const config = require("./src/config");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

ensureDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.listen(config.PORT, () => {
  console.log(`AM Premium Store jalan di http://localhost:${config.PORT}`);
});
