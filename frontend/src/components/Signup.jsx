import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

function Signup() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { isLoggedIn } = useAuth();
	const { t } = useTranslation();

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/profile");
		}
	}, [isLoggedIn, navigate]);

	const handleSignup = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axios.post(
				"/api/users/register",
				{ username, email, password, confirmPassword },
				{ withCredentials: true }
			);
			if (res.status === 201) {
				navigate("/login");
			}
		} catch (err) {
			setError(err.response?.data?.message || t("signup.error"));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center animate-fade-in-up">
					<div className="mb-4 flex items-center justify-center">
						<svg className="w-12 h-12 text-indigo-400 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<circle cx="12" cy="8" r="4" />
							<path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
							<path d="M20 8v6" />
							<path d="M23 11h-6" />
						</svg>
					</div>
					<h2 className="mb-6 text-3xl font-extrabold text-indigo-700 text-center drop-shadow-sm">{t('signup.title')}</h2>
					<form className="w-full space-y-6" onSubmit={handleSignup}>
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-800 mb-1">
								{t('signup.username')}
							</label>
							<div className="relative">
								<svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
									<circle cx="12" cy="8" r="4" />
									<path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
								</svg>
								<input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									required
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-gray-800 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-150"
									placeholder={t('signup.username')}
								/>
							</div>
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
								{t('signup.email')}
							</label>
							<div className="relative">
								<svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
									<rect x="3" y="7" width="18" height="10" rx="2" />
									<path d="M3 7l9 6 9-6" />
								</svg>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-gray-800 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-150"
									placeholder={t('signup.email')}
								/>
							</div>
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
								{t('signup.password')}
							</label>
							<div className="relative">
								<svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
									<rect x="5" y="11" width="14" height="8" rx="2" />
									<path d="M12 16v-2" />
									<path d="M8 11V7a4 4 0 018 0v4" />
								</svg>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="new-password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-gray-800 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-150"
									placeholder={t('signup.password')}
								/>
							</div>
						</div>
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-1">
								{t('signup.confirm_password')}
							</label>
							<div className="relative">
								<svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0-6a2 2 0 012 2v2a2 2 0 01-2 2m0-6a2 2 0 00-2 2v2a2 2 0 002 2m0-6V7a4 4 0 00-8 0v2" /></svg>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									autoComplete="new-password"
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-gray-800 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-150"
									placeholder={t('signup.confirm_password')}
								/>
							</div>
						</div>
						{error && (
							<div className="text-red-500 text-sm text-center mt-2">{error}</div>
						)}
						<div>
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center items-center px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{loading ? (
									<svg className="animate-spin mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
								) : null}
								{t('signup.button')}
							</button>
						</div>
					</form>
					<div className="mt-6 text-center">
						<span className="text-blue-700 text-sm">{t('signup.have_account')} </span>
						<Link
							to="/login"
							className="text-blue-600 font-medium hover:underline focus:underline transition-colors duration-150"
						>
							{t('signup.login_link')}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Signup;
