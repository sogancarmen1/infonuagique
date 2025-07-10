const multer = require("multer");
const upload = multer({ dest: "uploads/" });


const express = require("express");
const {
	createAuctionItem,
	getAuctionItems,
	updateAuctionItem,
	deleteAuctionItem,
	getAuctionItemById,
	getAuctionItemsByUser,
	getAuctionWinner,
	getAuctionsWonByUser,
	forceEndAuction,
	forceEndAllAuctionsForUser,
} = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(getAuctionItems).post(authMiddleware,upload.single("image"), createAuctionItem);
router.post("/user", authMiddleware, getAuctionItemsByUser);
router.get("/winner/:id", getAuctionWinner);
router.post("/won", authMiddleware, getAuctionsWonByUser);
router.post("/force-end/:id", forceEndAuction);
router.post("/force-end-all/:userId", forceEndAllAuctionsForUser);

router
	.route("/:id")
	.get(getAuctionItemById)
	.put(authMiddleware, updateAuctionItem)
	.delete(authMiddleware, deleteAuctionItem);

module.exports = router;
