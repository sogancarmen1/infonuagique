import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AuctionItem.css";
import { io } from "socket.io-client";

const ITEMS_PER_PAGE = 10;

function AuctionItem() {
	const { id } = useParams();
	const [auctionItem, setAuctionItem] = useState(null);
	const [user, setUser] = useState(null);
	const [bids, setBids] = useState([]);
	const [winner, setWinner] = useState("");
	const [countdown, setCountdown] = useState({
		minutes: 0,
		seconds: 0,
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [loadingBids, setLoadingBids] = useState(true);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		const fetchAuctionItem = async () => {
			try {
				const res = await axios.get(`/api/auctions/${id}`);
				setAuctionItem(res.data);
			} catch (error) {
				setError(t('auction.error'));
				console.error("Error fetching auction item:", error);
			}
		};

		const fetchUser = async () => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			if (token) {
				try {
					const res = await axios.post(
						"/api/users/profile",
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setUser(res.data);
				} catch (error) {
					setError(t('auction.error'));
					console.error("Error fetching user profile:", error);
				}
			}
		};
        
		const fetchWinner = async () => {
			try {
				const res = await axios.get(`/api/auctions/winner/${id}`);
				setWinner(res.data.winner);
			} catch (error) {
				if (error.response?.data?.winner !== "") {
					setError(t('auction.error'));
					console.error("Error fetching auction winner:", error);
				}
			}
		};
		Promise.all([fetchAuctionItem(), fetchUser(), fetchWinner()]).finally(() => setLoading(false));
	}, [id, t]);

useEffect(() => {
    const fetchBids = async () => {
        setLoadingBids(true);
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("jwt="))
                ?.split("=")[1];
            
            const config = token ? {
                headers: { Authorization: `Bearer ${token}` }
            } : {};
            
            const res = await axios.get(`/api/bids/${id}`, config);
            
            const sortedBids = res.data.sort(
                (a, b) => b.bidAmount - a.bidAmount
            );
            setBids(sortedBids);
            setTotalPages(
                Math.ceil(sortedBids.length / ITEMS_PER_PAGE) || 0
            );
        } catch (error) {
            console.error("Error fetching bids:", error);
            // Gérer spécifiquement l'erreur 401
            if (error.response?.status === 401) {
                // Option 1: Rediriger vers la page de connexion
                // navigate('/login');
                
                // Option 2: Afficher un message à l'utilisateur
                alert(t('auction.login_required'));
            }
        } finally {
            setLoadingBids(false);
        }
    };

    fetchBids();
}, [id, navigate, t]);

	
	useEffect(() => {
		const updateCountdown = () => {
			if (auctionItem) {
				const endDate = new Date(auctionItem.endDate);
				const now = new Date();
				
				// Convert both times to UTC milliseconds
				const endTimeUTC = Date.UTC(
					endDate.getUTCFullYear(),
					endDate.getUTCMonth(),
					endDate.getUTCDate(),
					endDate.getUTCHours(),
					endDate.getUTCMinutes(),
					endDate.getUTCSeconds()
				);
				
				const nowUTC = Date.UTC(
					now.getUTCFullYear(),
					now.getUTCMonth(),
					now.getUTCDate(),
					now.getUTCHours(),
					now.getUTCMinutes(),
					now.getUTCSeconds()
				);
				
				const timeDiff = endTimeUTC - nowUTC;
				
				if (timeDiff > 0) {
					const minutes = Math.floor(timeDiff / (1000 * 60));
					const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
					setCountdown({ minutes, seconds });
				} else {
					setCountdown({ minutes: 0, seconds: 0 });
				}
			}
		};

		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	}, [auctionItem]);

	useEffect(() => {
		const socket = io();
		const handleAuctionRestarted = (data) => {
			if (data.auctionId === id) {
				Promise.all([
					axios.get(`/api/auctions/${id}`),
					axios.get(`/api/auctions/winner/${id}`)
				]).then(([itemRes, winnerRes]) => {
					setAuctionItem(itemRes.data);
					setWinner(winnerRes.data.winner);
					setCountdown({ minutes: 5, seconds: 0 });
				});
				console.log(`Auction ${data.auctionId} restarted in real time.`);
			}
		};
		socket.on("auctionRestarted", handleAuctionRestarted);
		return () => {
			socket.off("auctionRestarted", handleAuctionRestarted);
			socket.disconnect();
		};
	}, [id]);

	// [REAL-TIME BID UPDATE]
	useEffect(() => {
		const socket = io();
		const handleBidUpdate = (data) => {
			if (auctionItem && data.auctionItemId === auctionItem._id) {
				// Refetch bids and update state
				axios.get(`/api/bids/${auctionItem._id}`)
					.then((res) => {
						const sortedBids = res.data.sort((a, b) => b.bidAmount - a.bidAmount);
						setBids(sortedBids);
						setTotalPages(Math.ceil(sortedBids.length / ITEMS_PER_PAGE) || 0);
					});
				// Optionally, refetch auction item for highest bid info
				axios.get(`/api/auctions/${auctionItem._id}`)
					.then((res) => setAuctionItem(res.data));
			}
		};
		socket.on("bidUpdate", handleBidUpdate);
		return () => {
			socket.off("bidUpdate", handleBidUpdate);
			socket.disconnect();
		};
	}, [auctionItem]);

	const handlePageChange = (page) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const paginatedBids = bids.slice(startIndex, endIndex);

	const highestBidObj = bids.length > 0
		? bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0])
		: null;

	if (loading) {
		return <div className="flex justify-center items-center h-96"><svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>;
	}
	if (error) {
		return <div className="text-center text-red-500 py-8">{error}</div>;
	}

	if (!auctionItem || !user) {
		return <p className="mt-10 text-center text-white">{t('auction.loading_bids')}</p>;
	}

	const isAuctionEnded = auctionItem.ended;

	return (
		<div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-2xl border border-blue-100">
			<div className="flex flex-col md:flex-row gap-8 items-start">
				{/* Image */}
				<div className="w-full md:w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-md border border-blue-50 bg-blue-50">
					<img
						src={auctionItem.imageurl}
						alt={auctionItem.title}
						className="w-full h-64 object-cover"
						loading="lazy"
					/>
				</div>
				{/* Auction Info */}
				<div className="flex-1 flex flex-col gap-4">
					<h2 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
						{auctionItem.title}
					</h2>
					<p className="text-blue-700 text-lg mb-2">{auctionItem.description}</p>
					<div className="flex items-center gap-4 text-blue-600 text-base">
						<span className="font-semibold">{t('auction.starting_bid')}:</span>
						<span className="font-bold">${auctionItem.startingBid}</span>
					</div>
					<div className="flex items-center gap-4 text-blue-500 text-base">
						<span className="font-semibold">{t('auction.end_date')}:</span>
						<span className="text-blue-700">{auctionItem.endDate ? new Date(auctionItem.endDate).toLocaleString() : t('auction.no_end_date')}</span>
					</div>
				</div>
			</div>

			{/* Timer & Winner */}
			<div className={`mt-8 mb-6 p-6 rounded-2xl shadow flex flex-col items-center gap-4 ${isAuctionEnded ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-100'}`}>
				<h3 className="text-2xl font-bold flex items-center gap-2">
					{isAuctionEnded ? t('auction.auction_ended') : t('auction.time_remaining')}
				</h3>
				<div className="flex gap-4">
					{Object.entries(countdown).map(([unit, value]) => (
						<div key={unit} className="flex flex-col items-center">
							<span className="text-3xl font-mono font-bold text-blue-900 bg-white rounded-lg px-4 py-2 shadow border border-blue-100">
								{value < 10 ? `0${value}` : value}
							</span>
							<span className="text-xs text-blue-400 mt-1 uppercase">{unit}</span>
						</div>
					))}
				</div>
				{isAuctionEnded && winner && (
					<div className="flex flex-col items-center mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-xl shadow">
						<span className="flex items-center gap-2 text-lg font-bold text-yellow-800">
							{t('auction.congratulations')} {winner}!
						</span>
						<span className="text-yellow-700">{t('auction.winner_message')}</span>
					</div>
				)}
				{isAuctionEnded && !winner && (
					<div className="flex flex-col items-center mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-xl shadow">
						<span className="text-lg font-bold text-yellow-800">{t('auction.no_winner')}</span>
					</div>
				)}
			</div>

			{/* Highest Bidder */}
			{highestBidObj && !isAuctionEnded && (
				<div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4 shadow">
					<span className="font-semibold text-green-800">{t('auction.current_highest')}:</span>
					<span className="font-bold text-green-900">{highestBidObj.userId.username}</span>
					<span className="text-green-700 font-semibold">${highestBidObj.bidAmount}</span>
				</div>
			)}

			{/* Bids List */}
			<div className="mt-8">
				<h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
					{t('auction.bids')}
				</h3>
				{loadingBids ? (
					<p className="text-lg text-blue-400">{t('auction.loading_bids')}</p>
				) : paginatedBids.length ? (
					<div className="space-y-4">
						{paginatedBids.map((bid) => (
							<div key={bid._id} className="flex items-center justify-between p-4 bg-white border border-blue-100 rounded-xl shadow-sm">
								<div className="flex items-center gap-3">
									<span className="font-semibold text-blue-800">{bid.userId.username}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-bold text-green-700">${bid.bidAmount}</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-lg text-blue-400">{t('auction.no_bids')}</p>
				)}
				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-center gap-4 mt-8">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							className={`px-4 py-2 rounded-full font-semibold shadow border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-150 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
							disabled={currentPage === 1}
						>
							&lt;
						</button>
						<span className="text-base font-medium text-blue-700">
							{t('auctions.page')} {currentPage} {t('auctions.of')} {totalPages}
						</span>
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							className={`px-4 py-2 rounded-full font-semibold shadow border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-150 ${(currentPage === totalPages) ? 'opacity-50 cursor-not-allowed' : ''}`}
							disabled={currentPage === totalPages}
						>
							&gt;
						</button>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="flex flex-wrap justify-center gap-4 mt-10">
				{auctionItem.createdBy === user.id && (
					<Link
						to={`/auction/edit/${id}`}
						className="px-6 py-3 text-white bg-blue-600 rounded-full shadow hover:bg-blue-700 font-semibold transition-all duration-200"
					>
						{t('auction.edit')}
					</Link>
				)}
				{auctionItem.createdBy !== user.id && !isAuctionEnded && (
					<Link
						to={`/auction/bid/${id}`}
						className="px-6 py-3 text-white bg-green-600 rounded-full shadow hover:bg-green-700 font-semibold transition-all duration-200"
					>
						{t('auction.place_bid')}
					</Link>
				)}
			</div>
		</div>
	);
}

export default AuctionItem;
