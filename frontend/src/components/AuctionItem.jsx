import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AuctionItem.css";

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
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		const fetchAuctionItem = async () => {
			try {
				const res = await axios.get(`/api/auctions/${id}`);
				setAuctionItem(res.data);
			} catch (error) {
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
					console.error("Error fetching auction winner:", error);
				}
			}
		};
		fetchAuctionItem();
		fetchUser();
		fetchWinner();
	}, [id]);

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

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/auctions/${id}`);
			navigate("/auctions");
		} catch (error) {
			console.error("Error deleting auction item:", error);
		}
	};

	const handlePageChange = (page) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const paginatedBids = bids.slice(startIndex, endIndex);

	if (!auctionItem || !user) {
		return <p className="mt-10 text-center text-white">{t('auction.loading_bids')}</p>;
	}

	
	const highestBid =
		bids.length > 0 ? Math.max(...bids.map((bid) => bid.bidAmount)) : 0;
	const isAuctionEnded = countdown.minutes <= 0 && countdown.seconds <= 0;

	return (
		<div className="max-w-4xl p-8 mx-auto mt-10 text-white bg-gray-900 rounded-lg shadow-lg">
				<div className="flex flex-col md:flex-row gap-6 items-start">
					<div className="flex-1">
						<h2 className="mb-4 text-4xl font-bold">{auctionItem.title}</h2>
							<p className="mb-4 text-lg">{auctionItem.description}</p>
						<p className="mb-4 text-lg">
							
							{t('auction.starting_bid')}:{" "}
					
							<span className="font-semibold">${auctionItem.startingBid}</span>
						</p>
						{/* <p className="mb-4 text-lg">
							{t('auction.current_highest')}:{" "}
							<span className="font-semibold">${highestBid}</span>
						</p> */}
					</div>

				<div className="w-full md:w-96 flex-shrink-0">
					<img
						src={auctionItem.imageurl}
						alt={auctionItem.title}
						className="w-full h-auto object-cover rounded"
					/>
				</div>
			</div>

			<div
				className={`text-center mb-4 p-6 rounded-lg shadow-lg ${
					isAuctionEnded ? "bg-red-600" : "bg-green-600"
				}`}
			>
				<h3 className="mb-2 text-3xl font-bold">
					{isAuctionEnded ? t('auction.auction_ended') : t('auction.time_remaining')}
				</h3>
				<div className="countdown-grid">
					{Object.entries(countdown).map(([unit, value]) => (
						<div key={unit} className="countdown-card">
							<div className="countdown-front">
								{value < 10 ? `0${value}` : value}
							</div>
							<div className="countdown-back">
								{unit.charAt(0).toUpperCase()}
							</div>
						</div>
					))}
				</div>
				{isAuctionEnded && winner && (
					<div className="p-4 mt-6 font-bold text-center text-black bg-yellow-500 rounded-lg">
						<h3 className="text-2xl">
							{t('auction.congratulations')} {winner.username}!
						</h3>
						<p className="text-xl">
							{t('auction.winner_message')}
						</p>
					</div>
				)}
				{isAuctionEnded && !winner && (
					<div className="p-4 mt-6 font-bold text-center text-black bg-yellow-500 rounded-lg">
						<h3 className="text-2xl">{t('auction.no_winner')}</h3>
					</div>
				)}
			</div>

			<h3 className="mb-4 text-3xl font-bold">{t('auction.bids')}</h3>
			{loadingBids ? (
				<p className="text-xl text-gray-400">{t('auction.loading_bids')}</p>
			) : paginatedBids.length ? (
				<div className="mb-6">
					{paginatedBids.map((bid) => {
						return (
							<div
								key={bid._id}
								className="p-4 mb-4 bg-gray-700 rounded-lg"
							>
								<p className="text-lg">
									<span className="font-semibold">{t('auction.bidder')}:</span>{" "}
									{bid.userId.username}
								</p>
								<p className="text-lg">
									<span className="font-semibold">{t('auction.bid_amount')}:</span>{" "}
									${bid.bidAmount}
								</p>
							</div>
						);
					})}
					<div className="flex items-center justify-between mt-6">
						{/* <button
							onClick={() => handlePageChange(currentPage - 1)}
							className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
								currentPage === 1 || totalPages === 0
									? "cursor-not-allowed opacity-50"
									: ""
							}`}
							disabled={currentPage === 1 || totalPages === 0}
						>
							{t('auctions.previous')}
						</button>
						<span className="text-gray-400 text-center">
							{t('auctions.page')} {currentPage} {t('auctions.of')} {totalPages === 0 ? 1 : totalPages}
						</span>
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
								totalPages === 0 || currentPage === totalPages
									? "cursor-not-allowed opacity-50"
									: ""
							}`}
							disabled={totalPages === 0 || currentPage === totalPages}
						>
							{t('auctions.next')}
						</button> */}
					</div>
				</div>
			) : (
				<p className="text-xl text-gray-400">{t('auction.no_bids')}</p>
			)}

			{auctionItem.createdBy === user.id && (
				<div className="flex justify-center mt-6 space-x-4">
					<Link
						to={`/auction/edit/${id}`}
						className="px-6 py-3 text-white bg-blue-700 rounded-lg hover:bg-blue-800"
					>
						{t('auction.edit')}
					</Link>
					{/* <button
						onClick={handleDelete}
						className="px-6 py-3 text-white bg-red-700 rounded-lg hover:bg-red-800"
					>
						{t('auction.delete')}
					</button> */}
				</div>
			)}
			{auctionItem.createdBy !== user.id && !isAuctionEnded && (
				<Link
					to={`/auction/bid/${id}`}
					className="items-center justify-center block px-6 py-3 mt-6 text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
				>
					{t('auction.place_bid')}
				</Link>
			)}
		</div>
	);
}

export default AuctionItem;
