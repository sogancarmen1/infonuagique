const AuctionItem = require('../models/AuctionItem');
const Bid = require('../models/Bid');
let io;
try { io = require('../server').io; } catch (e) { io = null; }

async function processAuctions() {
    const now = new Date();
    // Find all auctions that are not ended and should be ended
    const auctions = await AuctionItem.find({ ended: false });
    for (const auction of auctions) {
        const endTime = new Date(auction.createdAt.getTime() + 5 * 60 * 1000);
        if (now >= endTime) {
            const bids = await Bid.find({ auctionItemId: auction._id });
            if (bids.length === 0) {
                // No valid bids, restart auction
                auction.createdAt = now;
                auction.endDate = new Date(now.getTime() + 5 * 60 * 1000);
                auction.ended = false; // <-- ensures the auction is open again!
                auction.winner = null; // <-- explicitly reset winner
                await auction.save();
                console.log(`Auction restarted for item ${auction._id} due to no bids.`);
                if (io) {
                    io.emit('auctionRestarted', { auctionId: auction._id.toString(), endDate: auction.endDate });
                }
                continue;
            }
            // Find highest bid(s)
            const maxAmount = Math.max(...bids.map(b => b.bidAmount));
            const topBids = bids.filter(b => b.bidAmount === maxAmount);
            topBids.sort((a, b) => a.createdAt - b.createdAt); // Earliest wins
            auction.winner = topBids[0].userId;
            // If there are bids, end the auction
            auction.ended = true;
            auction.endDate = endTime;
            await auction.save();
        }
    }
}

function startAuctionScheduler() {
    setInterval(processAuctions, 30 * 1000); // Check every 30 seconds
}

module.exports = { startAuctionScheduler }; 