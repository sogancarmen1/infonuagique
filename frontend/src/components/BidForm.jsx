import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BidForm = () => {
	const { id } = useParams();
	const [auctionItem, setAuctionItem] = useState(null);
	const [bidAmount, setBidAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [optimisticSuccess, setOptimisticSuccess] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		const fetchAuctionItem = async () => {
			const res = await axios.get(`/api/auctions/${id}`);
			setAuctionItem(res.data);
			setBidAmount(res.data.startingBid || "");
		};

		fetchAuctionItem();
	}, [id]);

	const handleBid = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setOptimisticSuccess(false);
		// Optimistically show success and redirect
		setOptimisticSuccess(true);
		setTimeout(() => {
			toast.success(t('auction.bid_success') || 'Bid placed! Redirecting...');
			navigate(`/auction/${id}`);
		}, 500); // Short delay for user feedback
		try {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			await axios.post(
				"/api/bids",
				{ auctionItemId: id, bidAmount },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// No-op: already redirected
		} catch (err) {
			setOptimisticSuccess(false);
			setError(t('auction.error'));
			toast.error(t('auction.error'));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (!auctionItem) return <div>{t('auction.loading_bids')}</div>;

	return (
		<div className="max-w-lg p-6 mx-auto mt-12 bg-white rounded-lg shadow-md">
			<ToastContainer position="top-center" autoClose={2000} />
			<h2 className="mb-6 text-3xl font-extrabold text-gray-800">
				{t('auction.place_bid')}
			</h2>
			<div className="p-4 mb-6 bg-gray-100 border border-gray-200 rounded-lg">
				<p className="text-lg font-medium text-gray-700">
					{t('auction.starting_bid')}:
				</p>
				<p className="text-2xl font-bold text-gray-900">
					${auctionItem.startingBid.toFixed(2)}
				</p>
			</div>
			<form onSubmit={handleBid} className="space-y-4">
				<div>
					<label className="block mb-2 text-lg font-medium text-gray-700">
						{t('auction.bid_amount')}
					</label>
					<input
						type="number"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						value={bidAmount}
						onChange={(e) => setBidAmount(e.target.value)}
						min={auctionItem.startingBid}
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
					disabled={loading}
				>
					{loading ? (
						<span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>{t('auction.place_bid')}...</span>
					) : (
						t('auction.place_bid')
					)}
				</button>
				{optimisticSuccess && (
					<div className="text-green-600 text-center mt-2">{t('auction.bid_success')}</div>
				)}
				{error && <div className="text-red-500 text-center mt-2">{error}</div>}
			</form>
		</div>
	);
};

export default BidForm;
