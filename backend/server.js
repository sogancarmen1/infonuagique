const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = express.Router();
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(
	cors({
		origin: process.env.ORIGIN,
		methods: ["GET", "PUT", "POST", "DELETE"],
		credentials: true,
	})
);
app.use(router);
app.use(cookieParser());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));

app.use(express.static(path.resolve(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
