import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
				`https://infonuagique.onrender.com/api/users/register`,
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
		<div
			className="flex items-center justify-center min-h-screen bg-gray-700 bg-cover bg-center"
			style={{
				backgroundImage:
					"url('https://source.unsplash.com/1600x900/?signup,technology')",
			}}
		>
			<div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg">
				<h2 className="mb-6 text-3xl font-semibold text-white text-center">
					{t("signup.title")}
				</h2>
				<form onSubmit={handleSignup} className="space-y-4">
					<div className="flex items-center border rounded-md border-gray-600 bg-gray-700">
						<FiUser className="w-6 h-6 text-gray-400 ml-3" />
						<input
							type="text"
							className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder={t("signup.username")}
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center border rounded-md border-gray-600 bg-gray-700">
						<FiMail className="w-6 h-6 text-gray-400 ml-3" />
						<input
							type="email"
							className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder={t("signup.email")}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center border rounded-md border-gray-600 bg-gray-700">
						<FiLock className="w-6 h-6 text-gray-400 ml-3" />
						<input
							type="password"
							className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder={t("signup.password")}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center border rounded-md border-gray-600 bg-gray-700">
						<FiLock className="w-6 h-6 text-gray-400 ml-3" />
						<input
							type="password"
							className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder={t("signup.confirm_password")}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center justify-between mt-4">
						<p className="text-white">
							{t("signup.already_account")} {" "}
							<Link to="/login" className="text-indigo-300 hover:underline">
								{t("signup.login_link")}
							</Link>
						</p>
						<button
							type="submit"
							className="px-6 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							disabled={loading}
						>
							{loading ? (
								<AiOutlineLoading3Quarters className="w-6 h-6 animate-spin mx-auto" />
							) : (
								t("signup.title")
							)}
						</button>
					</div>
				</form>
				{error && (
					<div className="mt-4 text-red-300 text-center">{error}</div>
				)}
			</div>
		</div>
	);
}

export default Signup;
