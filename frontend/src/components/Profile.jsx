import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const ITEMS_PER_PAGE = 3;

const TABS = [
	{ key: "auctions", label: "profile.your_auctions", icon: (
		<svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="2"/></svg>
	) },
	{ key: "bids", label: "profile.your_bids", icon: (
		<svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/><circle cx="7" cy="16" r="1.5" fill="currentColor"/></svg>
	) },
	{ key: "won", label: "profile.your_victories", icon: (
		<svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 21h8m-4-4v4m8-16v2a4 4 0 01-4 4H6a4 4 0 01-4-4V5" stroke="currentColor" strokeWidth="2"/><path d="M17 9c2.21 0 4-1.79 4-4" stroke="currentColor" strokeWidth="2"/><path d="M7 9C4.79 9 3 7.21 3 5" stroke="currentColor" strokeWidth="2"/></svg>
	) },
];

function Profile() {
	const [user, setUser] = useState(null);
	const [auctions, setAuctions] = useState([]);
	const [bids, setBids] = useState([]);
	const [wonAuctions, setWonAuctions] = useState([]);
	const [currentPageAuctions, setCurrentPageAuctions] = useState(1);
	const [currentPageBids, setCurrentPageBids] = useState(1);
	const [currentPageWon, setCurrentPageWon] = useState(1);
	const [totalPagesAuctions, setTotalPagesAuctions] = useState(1);
	const [totalPagesBids, setTotalPagesBids] = useState(1);
	const [totalPagesWon, setTotalPagesWon] = useState(1);
	const [activeTab, setActiveTab] = useState("auctions");
	const [loadingAuctions, setLoadingAuctions] = useState(false);
	const [loadingBids, setLoadingBids] = useState(false);
	const [loadingWon, setLoadingWon] = useState(false);
	const [errorAuctions, setErrorAuctions] = useState("");
	const [errorBids, setErrorBids] = useState("");
	const [errorWon, setErrorWon] = useState("");
	const { t } = useTranslation();

	// Fetch victories when switching to 'won' tab
	useEffect(() => {
		if (activeTab === "won") {
			setLoadingWon(true);
			setErrorWon("");
			const fetchWonAuctions = async () => {
				const token = document.cookie
					.split("; ")
					.find((row) => row.startsWith("jwt="))
					?.split("=")[1];
				if (token) {
					try {
						const res = await axios.post(
							"/api/auctions/won",
							{},
							{
								headers: { Authorization: `Bearer ${token}` },
							}
						);
						setWonAuctions(res.data.wonAuctions);
						const newTotalPages = Math.ceil(res.data.wonAuctions.length / ITEMS_PER_PAGE);
						setTotalPagesWon(newTotalPages);
						// If the current page is now out of range, set it to the last page
						setCurrentPageWon((prev) => (prev > newTotalPages ? newTotalPages || 1 : prev));
					} catch (error) {
						setErrorWon(t('auction.error'));
						console.error(error);
					} finally {
						setLoadingWon(false);
					}
				} else {
					setLoadingWon(false);
				}
			};
			fetchWonAuctions();
		}
	}, [activeTab]);

	useEffect(() => {
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
					console.error(error);
				}
			}
		};

		const fetchAuctions = async () => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			if (token) {
				try {
					const res = await axios.post(
						"/api/auctions/user",
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setAuctions(res.data.auctionItems);
					setTotalPagesAuctions(
						Math.ceil(res.data.auctionItems.length / ITEMS_PER_PAGE)
					);
				} catch (error) {
					console.error(error);
				}
			}
		};

		const fetchBids = async () => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			if (token) {
				try {
					const res = await axios.post(
						"/api/bids/user",
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setBids(res.data.bids);
					setTotalPagesBids(
						Math.ceil(res.data.bids.length / ITEMS_PER_PAGE)
					);
				} catch (error) {
					console.error(error);
				}
			}
		};

		const fetchWonAuctions = async () => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			if (token) {
				try {
					const res = await axios.post(
						"/api/auctions/won",
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setWonAuctions(res.data.wonAuctions);
					setTotalPagesWon(
						Math.ceil(res.data.wonAuctions.length / ITEMS_PER_PAGE)
					);
				} catch (error) {
					console.error(error);
				}
			}
		};

		fetchUser();
		fetchAuctions();
		fetchBids();
		fetchWonAuctions();
	}, []);

	const handlePageChange = (page, type) => {
		if (page > 0) {
			if (type === "auctions") {
				if (page <= totalPagesAuctions) setCurrentPageAuctions(page);
			} else if (type === "bids") {
				if (page <= totalPagesBids) setCurrentPageBids(page);
			} else if (type === "won") {
				if (page <= totalPagesWon) setCurrentPageWon(page);
			}
		}
	};

	const startIndexAuctions = (currentPageAuctions - 1) * ITEMS_PER_PAGE;
	const endIndexAuctions = startIndexAuctions + ITEMS_PER_PAGE;
	const paginatedAuctions = auctions.slice(
		startIndexAuctions,
		endIndexAuctions
	);
	
	const startIndexBids = (currentPageBids - 1) * ITEMS_PER_PAGE;
	const endIndexBids = startIndexBids + ITEMS_PER_PAGE;
	const paginatedBids = bids.slice(startIndexBids, endIndexBids);

	const highestBidObj = bids.length > 0
		? bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0])
		: null;

	const startIndexWon = (currentPageWon - 1) * ITEMS_PER_PAGE;
	const endIndexWon = startIndexWon + ITEMS_PER_PAGE;
	const paginatedWon = wonAuctions.slice(startIndexWon, endIndexWon);

	if (!user) {
		return (
			<div className="flex items-center justify-center h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
				<div className="w-16 h-16 border-t-4 border-b-4 border-blue-400 rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-12 px-2 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto">
				{/* User Profile Card */}
				<div className="backdrop-blur-md bg-white/70 shadow-xl rounded-2xl p-8 mb-10 flex flex-col sm:flex-row items-center gap-8 border border-blue-100">
					<div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 via-blue-100 to-white shadow-lg">
						<svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2"/></svg>
					</div>
					<div className="flex-1">
						<h2 className="text-2xl font-bold text-blue-900 mb-2">{user.username}</h2>
						<p className="text-blue-600 text-lg">{user.email}</p>
					</div>
				</div>

				{/* Tabs Navigation */}
				<div className="flex justify-center mb-8">
					<div className="inline-flex rounded-xl bg-white/80 shadow border border-blue-100 overflow-hidden">
						{TABS.map(tab => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`flex items-center px-6 py-3 font-semibold transition-all duration-200 focus:outline-none text-base ${activeTab === tab.key ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 shadow-inner" : "text-blue-500 hover:bg-blue-50"}`}
								style={{ minWidth: 140 }}
								disabled={loadingAuctions || loadingBids || loadingWon}
							>
								{tab.icon}
								{t(tab.label)}
							</button>
						))}
					</div>
						</div>

				{/* Tabs Content */}
				<div className="relative min-h-[350px]">
					{/* Vos enchères */}
					<div className={`transition-all duration-500 ${activeTab === "auctions" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"} absolute w-full`}>
						{loadingAuctions ? (
							<div className="flex justify-center items-center py-12"><svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>
						) : errorAuctions ? (
							<div className="text-center text-red-500 py-8">{errorAuctions}</div>
						) : (
						<SectionAuctions
							paginatedAuctions={paginatedAuctions}
							t={t}
							handlePageChange={handlePageChange}
							currentPageAuctions={currentPageAuctions}
							totalPagesAuctions={totalPagesAuctions}
						/>
						)}
					</div>
					{/* Vos mises */}
					<div className={`transition-all duration-500 ${activeTab === "bids" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"} absolute w-full`}>
						{loadingBids ? (
							<div className="flex justify-center items-center py-12"><svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>
						) : errorBids ? (
							<div className="text-center text-red-500 py-8">{errorBids}</div>
						) : (
							<>
						{highestBidObj && (
							<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 shadow-sm">
								<div className="font-semibold">{t('auction.current_highest')}:</div>
								<div>
									<span className="font-bold">{highestBidObj.userId.username}</span>
									{" "}
									<span className="text-blue-700 font-semibold">
										(${highestBidObj.bidAmount})
									</span>
								</div>
							</div>
						)}
						<SectionBids
							paginatedBids={paginatedBids}
							t={t}
							handlePageChange={handlePageChange}
							currentPageBids={currentPageBids}
							totalPagesBids={totalPagesBids}
						/>
							</>
						)}
					</div>
					{/* Victoires */}
					<div className={`transition-all duration-500 ${activeTab === "won" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"} absolute w-full`}>
						{loadingWon ? (
							<div className="flex justify-center items-center py-12"><svg className="animate-spin h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>
						) : errorWon ? (
							<div className="text-center text-red-500 py-8">{errorWon}</div>
						) : (
						<SectionWon
							paginatedWon={paginatedWon}
							t={t}
							handlePageChange={handlePageChange}
							currentPageWon={currentPageWon}
							totalPagesWon={totalPagesWon}
								loadingWon={loadingWon}
								errorWon={errorWon}
						/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// Section Vos enchères
function SectionAuctions({ paginatedAuctions, t, handlePageChange, currentPageAuctions, totalPagesAuctions }) {
	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-blue-800 flex items-center">
					<svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="2"/></svg>
								{t('profile.your_auctions')}
							</h2>
							<Link
								to="/auction/create"
					className="px-5 py-2 rounded-full bg-white/80 border border-blue-200 text-blue-700 font-semibold shadow hover:bg-blue-50 transition-all duration-200"
							>
								{t('profile.create_auction')}
							</Link>
						</div>
						{paginatedAuctions.length ? (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{paginatedAuctions.map((auction) => (
									<div
										key={auction._id}
							className="rounded-2xl bg-white/70 backdrop-blur-md shadow-lg border border-blue-100 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 flex flex-col"
									>
											<img
												src={auction.imageurl}
												alt={auction.title}
								className="w-full h-44 object-cover rounded-t-2xl"
												loading="lazy"
												/>
							<div className="p-5 flex-1 flex flex-col">
								<h3 className="text-xl font-bold text-blue-900 mb-1">{auction.title}</h3>
								<p className="text-blue-700 text-sm mb-2 line-clamp-2">{auction.description}</p>
								<div className="flex items-center text-blue-500 text-sm mb-2">
									<span className="mr-2">{t('profile.starting_bid')}:</span>
									<span className="font-semibold">${auction.startingBid}</span>
								</div>
								<div className="flex items-center text-blue-400 text-xs mb-2">
									<span>{t('profile.end_date')}:</span>
									<span className="ml-1">{new Date(auction.endDate).toLocaleString()}</span>
								</div>
								<div className="mt-auto pt-2">
											<Link
												to={`/auction/${auction._id}`}
										className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all duration-200"
											>
												{t('profile.view_auction')}
											</Link>
								</div>
										</div>
									</div>
								))}
							</div>
						) : (
				<p className="text-lg text-blue-400 text-center py-8 animate-fade-in">
								{t('profile.no_active_auctions')}
							</p>
						)}
			<Pagination currentPage={currentPageAuctions} totalPages={totalPagesAuctions} onPageChange={p => handlePageChange(p, "auctions")} color="blue" />
						</div>
	);
}

SectionAuctions.propTypes = {
	paginatedAuctions: PropTypes.array.isRequired,
	t: PropTypes.func.isRequired,
	handlePageChange: PropTypes.func.isRequired,
	currentPageAuctions: PropTypes.number.isRequired,
	totalPagesAuctions: PropTypes.number.isRequired,
};

// Section Vos mises
function SectionBids({ paginatedBids, t, handlePageChange, currentPageBids, totalPagesBids }) {
	return (
		<div className="w-full">
			<div className="flex items-center mb-6">
				<h2 className="text-2xl font-bold text-green-800 flex items-center">
					<svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/><circle cx="7" cy="16" r="1.5" fill="currentColor"/></svg>
								{t('profile.your_bids')}
							</h2>
			</div>
							{paginatedBids.length ? (
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									{paginatedBids.map((bid) => (
										<div
											key={bid._id}
							className="rounded-2xl bg-white/70 backdrop-blur-md shadow-lg border border-green-100 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 flex flex-col"
										>
												<img
												src={bid.auctionItem.imageurl}
												alt={bid.auctionItem.title}
								className="w-full h-44 object-cover rounded-t-2xl"
												loading="lazy"
												/>
							<div className="p-5 flex-1 flex flex-col">
								<h3 className="text-xl font-bold text-green-900 mb-1">{bid.auctionItem.title}</h3>
								<p className="text-green-700 text-sm mb-2 line-clamp-2">{bid.auctionItem.description}</p>
								<div className="flex items-center text-green-500 text-sm mb-2">
									<span className="mr-2">{t('profile.bid_amount')}:</span>
									<span className="font-semibold">${bid.bidAmount}</span>
								</div>
								<div className="flex items-center text-green-400 text-xs mb-2">
									<span>{t('profile.bid_date')}:</span>
									<span className="ml-1">{new Date(bid.createdAt).toLocaleString()}</span>
								</div>
								<div className="mt-auto pt-2">
												<Link
													to={`/auction/${bid.auctionItem._id}`}
										className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow hover:from-green-500 hover:to-green-700 transition-all duration-200"
												>
													{t('profile.view_auction')}
												</Link>
								</div>
											</div>
										</div>
									))}
								</div>
							) : (
				<p className="text-lg text-green-400 text-center py-8 animate-fade-in">
									{t('profile.no_active_bids')}
								</p>
							)}
			<Pagination currentPage={currentPageBids} totalPages={totalPagesBids} onPageChange={p => handlePageChange(p, "bids")} color="green" />
							</div>
	);
}

SectionBids.propTypes = {
	paginatedBids: PropTypes.array.isRequired,
	t: PropTypes.func.isRequired,
	handlePageChange: PropTypes.func.isRequired,
	currentPageBids: PropTypes.number.isRequired,
	totalPagesBids: PropTypes.number.isRequired,
};

// Section Victoires
function SectionWon({ paginatedWon, t, handlePageChange, currentPageWon, totalPagesWon, loadingWon, errorWon }) {
	if (loadingWon) {
		return <div className="flex justify-center items-center py-12"><svg className="animate-spin h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>;
	}
	if (errorWon) {
		return <div className="text-center text-red-500 py-8">{errorWon}</div>;
	}
	return (
		<div className="w-full">
			<div className="flex items-center mb-6">
				<h2 className="text-2xl font-bold text-yellow-700 flex items-center">
					<svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 21h8m-4-4v4m8-16v2a4 4 0 01-4 4H6a4 4 0 01-4-4V5" stroke="currentColor" strokeWidth="2"/><path d="M17 9c2.21 0 4-1.79 4-4" stroke="currentColor" strokeWidth="2"/><path d="M7 9C4.79 9 3 7.21 3 5" stroke="currentColor" strokeWidth="2"/></svg>
								{t('profile.your_victories')}
							</h2>
			</div>
							{paginatedWon.length ? (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									{paginatedWon.map((auction) => (
										<div
											key={auction.auctionId}
							className="rounded-2xl bg-white/70 backdrop-blur-md shadow-lg border border-yellow-100 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 flex flex-col relative"
										>
												<img
												src={auction.imageurl}
												alt={auction.title}
								className="w-full h-44 object-cover rounded-t-2xl"
												loading="lazy"
												/>
							<div className="p-5 flex-1 flex flex-col">
								<h3 className="text-xl font-bold text-yellow-800 mb-1 flex items-center">
									<svg className="w-5 h-5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
													{auction.title}
												</h3>
								<p className="text-yellow-700 text-sm mb-2 line-clamp-2">{auction.description}</p>
								<div className="flex items-center text-yellow-600 text-sm mb-2">
									<span className="mr-2">{t('profile.winning_bid')}:</span>
									<span className="font-semibold">${auction.winningBid}</span>
								</div>
								<div className="flex items-center text-yellow-500 text-xs mb-2">
									<span>{t('profile.end_date')}:</span>
									<span className="ml-1">{new Date(auction.endDate).toLocaleString()}</span>
								</div>
								<div className="mt-auto pt-2">
												<Link
													to={`/auction/${auction.auctionId}`}
										className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold shadow hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200"
												>
													{t('profile.view_your_auction')}
												</Link>
								</div>
							</div>
							<div className="absolute top-3 right-3">
								<span className="inline-flex items-center px-2 py-1 text-xs font-bold leading-none text-yellow-900 bg-yellow-300 rounded-full shadow">Victoire</span>
											</div>
										</div>
									))}
								</div>
							) : (
				<p className="text-lg text-yellow-400 text-center py-8 animate-fade-in">
									{t('profile.no_victories')}
								</p>
							)}
			<Pagination currentPage={currentPageWon} totalPages={totalPagesWon} onPageChange={p => handlePageChange(p, "won")} color="yellow" />
		</div>
	);
}

SectionWon.propTypes = {
	paginatedWon: PropTypes.array.isRequired,
	t: PropTypes.func.isRequired,
	handlePageChange: PropTypes.func.isRequired,
	currentPageWon: PropTypes.number.isRequired,
	totalPagesWon: PropTypes.number.isRequired,
	loadingWon: PropTypes.bool.isRequired,
	errorWon: PropTypes.string.isRequired,
};

// Pagination component
function Pagination({ currentPage, totalPages, onPageChange, color }) {
	return (
		<div className="flex items-center justify-center mt-8 gap-2">
								<button
				onClick={() => onPageChange(currentPage - 1)}
				className={`px-3 py-1 rounded-full font-semibold shadow-sm border transition-all duration-150 text-xs ${color === "blue" ? "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" : color === "green" ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100"} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
				disabled={currentPage === 1}
								>
				&lt;
								</button>
			<span className="text-xs font-medium text-gray-500">
				{currentPage} / {totalPages === 0 ? 1 : totalPages}
								</span>
								<button
				onClick={() => onPageChange(currentPage + 1)}
				className={`px-3 py-1 rounded-full font-semibold shadow-sm border transition-all duration-150 text-xs ${color === "blue" ? "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" : color === "green" ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100"} ${(currentPage === totalPages || totalPages === 0) ? "opacity-50 cursor-not-allowed" : ""}`}
				disabled={currentPage === totalPages || totalPages === 0}
								>
				&gt;
								</button>
		</div>
	);
}

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	color: PropTypes.string.isRequired,
};

export default Profile;
