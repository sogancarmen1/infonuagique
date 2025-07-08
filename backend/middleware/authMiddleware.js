const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization; // récupère le header Authorization
  
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
	  return res.status(401).json({ message: "No token, authorization denied" });
	}
  
	// Extrait le token après "Bearer "
	const token = authHeader.split(" ")[1];
  
	try {
	  const decoded = jwt.verify(token, process.env.JWT_SECRET);
	  req.user = await User.findById(decoded.id).select("-password");
	  next();
	} catch (error) {
	  res.status(401).json({ message: "Token is not valid" });
	}
  };
  

module.exports = authMiddleware;
