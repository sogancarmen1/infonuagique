import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, useState, useEffect, lazy } from "react";
import { AuthProvider } from "./contexts/index";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import CreateAuctionItem from "./components/CreateAuctionItem";
import EditAuctionItem from "./components/EditAuctionItem";

// Lazy load main pages
const AuctionList = lazy(() => import("./components/AuctionList"));
const AuctionItem = lazy(() => import("./components/AuctionItem"));
const Signup = lazy(() => import("./components/Signup"));
const Login = lazy(() => import("./components/Login"));
const Profile = lazy(() => import("./components/Profile"));
const BidForm = lazy(() => import("./components/BidForm"));
const Logout = lazy(() => import("./components/Logout"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const login = () => {
		setIsLoggedIn(true);
	};

	const logout = () => {
		setIsLoggedIn(false);
	};

	const token = document.cookie
		.split("; ")
		.find((row) => row.startsWith("jwt="))
		?.split("=")[1];

	useEffect(() => {
		if (token) {
			login();
		} else {
			logout();
		}
	}, [token]);

	return (
		<AuthProvider value={{ isLoggedIn, login, logout }}>
			<Router>
				<Suspense fallback={<div className="flex justify-center items-center h-screen"><svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>}>
					<NavBar />
					<div className="pt-16 sm:pt-20">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/login" element={<Login />} />
							<Route
								path="/profile"
								element={<ProtectedRoute component={Profile} />}
							/>
							<Route path="/logout" element={<Logout />} />
							<Route path="/auctions" element={<AuctionList />} />
							<Route
								path="/auction/:id"
								element={<ProtectedRoute component={AuctionItem} />}
							/>
							<Route
								path="/auction/create"
								element={<ProtectedRoute component={CreateAuctionItem} />}
							/>
							<Route
								path="/auction/edit/:id"
								element={<ProtectedRoute component={EditAuctionItem} />}
							/>
							<Route
								path="/auction/bid/:id"
								element={<ProtectedRoute component={BidForm} />}
							/>
						</Routes>
					</div>
				</Suspense>
			</Router>
		</AuthProvider>
	);
}

export default App;
