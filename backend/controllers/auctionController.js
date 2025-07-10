require('../config/db'); // Ensures Mongoose connects using your config
require('dotenv').config();
const AuctionItem = require("../models/AuctionItem");
const Bid = require("../models/Bid");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
	cloud_name: process.env.Cloudinary_CLOUD_NAME, 
	api_key: process.env.Cloudinary_API_KEY,
	api_secret: process.env.Cloudinary_API_SECRET,

});

const createAuctionItem = async (req, res) => {
	const { title, description, startingBid } = req.body;
	const userId = req.user.id;
 
	try {
		if (!req.file) {
			return res.status(400).json({ message: "Image is required" });
		}

		const result = await cloudinary.uploader.upload(req.file.path);
		const imageUrl = result.secure_url;
		
		// Create auction with current timestamp
		const now = new Date();
		const auctionItem = await AuctionItem.create({
			title,
			description,
			imageurl: imageUrl,
			startingBid,
			createdAt: now,
			createdBy: userId,
		});

		res.status(201).json(auctionItem);
	} catch (error) {
		console.error("Error creating auction:", error);
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItems = async (req, res) => {
	try {
		const auctionItems = await AuctionItem.find();
		res.status(200).json(auctionItems);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Helper: End auction if needed
async function endAuctionIfNeeded(auctionItem) {
    if (!auctionItem.ended && new Date(auctionItem.endDate) <= new Date(Date.now())) {
        const bids = await Bid.find({ auctionItemId: auctionItem._id });
        if (bids.length > 0) {
            // [Tie-breaker]: In case of equal bid amounts, the earliest bid wins
            const sortedBids = bids.sort((a, b) => {
                if (b.bidAmount !== a.bidAmount) {
                    return b.bidAmount - a.bidAmount; // Higher bid first
                }
                return new Date(a.createdAt) - new Date(b.createdAt); // Earlier bid wins
            });
            auctionItem.winner = sortedBids[0].userId;
            auctionItem.ended = true;
            await auctionItem.save();
        }
        // If there are no bids, DO NOT end the auction here!
    }
}

// Patch getAuctionItemById to end auction if needed
const getAuctionItemById = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}
		// Calculate end time when auction is viewed (5 minutes from creation)
		const endTime = new Date(auctionItem.createdAt.getTime() + (5 * 60 * 1000));
		auctionItem.endDate = endTime;
		// End auction if needed
		await endAuctionIfNeeded(auctionItem);
		res.status(200).json(auctionItem);
	} catch (error) {
		console.error("Error fetching auction:", error);
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItemsByUser = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const { id } = jwt.decode(token, process.env.JWT_SECRET, (err) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ message: err.message });
			}
		});
		const auctionItems = await AuctionItem.find({ createdBy: id });
		res.status(200).json({
			auctionItems,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
};

const updateAuctionItem = async (req, res) => {
	const { id } = req.params;
	const { title, description, startingBid, endDate } = req.body;
	const userId = req.user.id;

	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		auctionItem.title = title || auctionItem.title;
		auctionItem.description = description || auctionItem.description;
		auctionItem.startingBid = startingBid || auctionItem.startingBid;
		auctionItem.endDate = endDate
			? new Date(new Date(endDate).getTime())
			: auctionItem.endDate;
		auctionItem.updatedAt = new Date(new Date().getTime());
		await auctionItem.save();

		res.json(auctionItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteAuctionItem = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		const bids = await Bid.find({ auctionItemId: id });
		for (const bid of bids) {
			await bid.remove();
		}

		await auctionItem.remove();

		res.json({ message: "Auction item removed" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionWinner = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res
				.status(404)
				.json({ winner: "", message: "Auction item not found" });
		}

		if (new Date(auctionItem.endDate) > new Date(Date.now())) {
			return res
				.status(400)
				.json({ winner: "", message: "Auction has not ended yet" });
		}

		const bids = await Bid.find({ auctionItemId: id });
		if (bids.length === 0) {
			return res
				.status(200)
				.json({ winner: "", message: "No bids found" });
		}

		// [Tie-breaker]: In case of equal bid amounts, the earliest bid wins
		const sortedBids = bids.sort((a, b) => {
			if (b.bidAmount !== a.bidAmount) {
				return b.bidAmount - a.bidAmount; // Higher bid first
			}
			return new Date(a.createdAt) - new Date(b.createdAt); // Earlier bid wins
		});
		const winner = await User.findById(sortedBids[0].userId);
		if (!winner) {
			return res
				.status(404)
				.json({ winner: "", message: "Winner not found" });
		}

		return res.status(200).json({ winner: winner.username, message: "Winner found" });
	} catch (error) {
		console.error("Error fetching winner:", error);
		res.status(500).json({ message: error.message });
	}
};

// Patch getAuctionsWonByUser to use winner and ended fields
const getAuctionsWonByUser = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const { id } = decodedToken;
		// Find all bids by the user
		const userBids = await Bid.find({ userId: id });
		const auctionIds = [...new Set(userBids.map(bid => bid.auctionItemId.toString()))];
		let wonAuctions = [];
		for (const auctionId of auctionIds) {
			const auction = await AuctionItem.findById(auctionId);
			if (!auction) {
				console.log(`[DEBUG] Auction ${auctionId} not found.`);
				continue;
			}
			console.log(`[DEBUG] Checking auction ${auctionId}: endDate=${auction.endDate}, ended=${auction.ended}, winner=${auction.winner}`);
			// If auction is over and not ended, set ended and winner
			if (!auction.ended && auction.endDate && new Date(auction.endDate) <= new Date(Date.now())) {
				const bids = await Bid.find({ auctionItemId: auctionId });
				console.log(`[DEBUG] Auction ${auctionId} is over. Bids:`, bids);
				if (bids.length > 0) {
					let highestBid = bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0]);
					auction.winner = highestBid.userId;
					console.log(`[DEBUG] Auction ${auctionId} highestBid:`, highestBid);
				} else {
					console.log(`[DEBUG] Auction ${auctionId} has no bids.`);
				}
				auction.ended = true;
				await auction.save();
			}
			// If user is the winner, add to results
			if (auction.ended && auction.winner && auction.winner.toString() === id) {
				// Optionally fetch winning bid amount
				const winningBid = await Bid.findOne({ auctionItemId: auctionId, userId: id }).sort({ bidAmount: -1 });
				wonAuctions.push({
					auctionId: auction._id,
					title: auction.title,
					description: auction.description,
					winningBid: winningBid ? winningBid.bidAmount : null,
					endDate: auction.endDate,
					imageurl: auction.imageurl || null
				});
				console.log(`[DEBUG] Auction ${auctionId} added as victory for user ${id}`);
			} else {
				console.log(`[DEBUG] Auction ${auctionId} not a victory for user ${id}. ended=${auction.ended}, winner=${auction.winner}`);
			}
		}
		res.status(200).json({ wonAuctions });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
};

// --- BACKFILL SCRIPT ---
// Run this manually once after deploying the new schema
async function backfillAuctionWinners() {
	const auctions = await AuctionItem.find({ ended: { $ne: true } });
	for (const auction of auctions) {
		if (auction.endDate && new Date(auction.endDate) <= new Date(Date.now())) {
			const bids = await Bid.find({ auctionItemId: auction._id });
			if (bids.length > 0) {
				let highestBid = bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0]);
				auction.winner = highestBid.userId;
			}
			auction.ended = true;
			await auction.save();
		}
	}
	console.log('Backfill complete');
}

// Uncomment and run this function ONCE after deployment:
// backfillAuctionWinners();

// Admin/test: Force end auction and set winner
const forceEndAuction = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}
		const bids = await Bid.find({ auctionItemId: id });
		if (bids.length > 0) {
			let highestBid = bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0]);
			auctionItem.winner = highestBid.userId;
		}
		auctionItem.ended = true;
		await auctionItem.save();
		res.status(200).json({ message: "Auction forcibly ended and winner set", auction: auctionItem });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Admin: Force end all auctions for a user
const forceEndAllAuctionsForUser = async (req, res) => {
	const { userId } = req.params;
	try {
		// Find all bids by the user
		const userBids = await Bid.find({ userId });
		const auctionIds = [...new Set(userBids.map(bid => bid.auctionItemId.toString()))];
		let updated = 0;
		for (const auctionId of auctionIds) {
			const auction = await AuctionItem.findById(auctionId);
			if (!auction) continue;
			if (auction.ended) continue;
			if (!auction.endDate || new Date(auction.endDate) > new Date(Date.now())) continue;
			const bids = await Bid.find({ auctionItemId: auctionId });
			if (bids.length === 0) continue;
			let highestBid = bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0]);
			if (highestBid.userId.toString() === userId) {
				auction.winner = userId;
				auction.ended = true;
				await auction.save();
				updated++;
			}
		}
		res.status(200).json({ message: `Force-ended ${updated} auctions for user ${userId}` });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Admin: Backfill endDate for all auctions missing it
const backfillEndDates = async () => {
	const auctions = await AuctionItem.find({ $or: [ { endDate: { $exists: false } }, { endDate: null } ] });
	let updated = 0;
	for (const auction of auctions) {
		if (!auction.createdAt) continue;
		auction.endDate = new Date(auction.createdAt.getTime() + 5 * 60 * 1000);
		await auction.save();
		updated++;
	}
	console.log(`Backfilled endDate for ${updated} auctions.`);
};

if (require.main === module) {
	require('../config/db');
	backfillEndDates().then(() => process.exit(0));
}

// Admin: Print all auctions where user is the highest bidder (for debugging)
const printAllUserHighestBidAuctions = async (userId) => {
	const userBids = await Bid.find({ userId });
	const auctionIds = [...new Set(userBids.map(bid => bid.auctionItemId.toString()))];
	let count = 0;
	for (const auctionId of auctionIds) {
		const auction = await AuctionItem.findById(auctionId);
		if (!auction) continue;
		const bids = await Bid.find({ auctionItemId: auctionId });
		if (bids.length === 0) continue;
		let highestBid = bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0]);
		if (highestBid.userId.toString() === userId) {
			count++;
			console.log(`[VICTORY] Auction: ${auction.title} | _id: ${auction._id} | endDate: ${auction.endDate} | ended: ${auction.ended} | winner: ${auction.winner}`);
		}
	}
	console.log(`User ${userId} is the highest bidder on ${count} auctions.`);
};

module.exports = {
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
	backfillEndDates,
	printAllUserHighestBidAuctions,
};
