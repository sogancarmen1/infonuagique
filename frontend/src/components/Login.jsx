import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTranslation } from "react-i18next";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { isLoggedIn, login } = useAuth();
	const { t } = useTranslation();

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/profile");
		}
	}, [isLoggedIn, navigate]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axios.post(
				"/api/users/login",
				{ email, password },
				{ withCredentials: true }
			);
			if (res.status === 200) {
				login();
				navigate("/profile");
			}
		} catch (err) {
			setError(err.response?.data?.message || t("login.error"));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
					<h2 className="mb-6 text-3xl font-extrabold text-blue-900 text-center">{t('login.title')}</h2>
					<form className="w-full space-y-6" onSubmit={handleLogin}>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-1">
								{t('login.email')}
							</label>
							<div className="relative">
								<FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 text-lg" />
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-150"
									placeholder={t('login.email_placeholder')}
								/>
							</div>
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-1">
								{t('login.password')}
							</label>
							<div className="relative">
								<FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 text-lg" />
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-150"
									placeholder={t('login.password_placeholder')}
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
									<AiOutlineLoading3Quarters className="animate-spin mr-2 text-lg" />
								) : null}
								{t('login.button')}
							</button>
						</div>
					</form>
					<div className="mt-6 text-center">
						<span className="text-blue-700 text-sm">{t('login.no_account')} </span>
						<Link
							to="/signup"
							className="text-blue-600 font-medium hover:underline focus:underline transition-colors duration-150"
						>
							{t('login.signup_link')}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
