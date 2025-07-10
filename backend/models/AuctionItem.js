const mongoose = require("mongoose");

const auctionItemSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	
	imageurl:{
		type: String,
		required: true,
	},
	
	startingBid: {
		type: Number,
		required: true,
	},
	endDate: {
		type: Date,
		required: false,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: new Date(new Date().getTime()),
	},
	updatedAt: {
		type: Date,
		default: new Date(new Date().getTime()),
	},
	winner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null,
	},
	ended: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("AuctionItem", auctionItemSchema);
