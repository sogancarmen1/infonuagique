import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { t, i18n } = useTranslation();
	const { isLoggedIn } = useAuth();
	const location = useLocation();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	const activeClass = "text-[#0861FF] after:scale-x-100";
	const inactiveClass = "text-gray-700 hover:text-[#0861FF] after:scale-x-0";
	const linkBaseClass = "relative px-3 py-2 text-lg font-medium transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-[#0861FF] after:transition-transform after:duration-300";

	return (
		<nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="relative flex h-16 sm:h-20 items-center">
					<div className="flex flex-shrink-0 items-center mr-6">
						<Link to="/" className="flex items-center">
							<img src="/images/logo.png" alt="Platform Logo" className="h-28 w-auto" />
						</Link>
					</div>
					<div className="flex flex-1 items-center justify-end space-x-4">
						<div className="hidden lg:flex items-center space-x-4">
							<Link
								to="/"
								className={`${linkBaseClass} ${isActive("/") ? activeClass : inactiveClass}`}
							>
								{t('footer.home')}
							</Link>
							<Link
								to="/auctions"
								className={`${linkBaseClass} ${isActive("/auctions") ? activeClass : inactiveClass}`}
							>
								{t('footer.auctions')}
							</Link>
						</div>
						<div className="hidden lg:flex items-center space-x-2">
							{!isLoggedIn ? (
								<>
									<Link
										to="/login"
										className={`${linkBaseClass} ${isActive("/login") ? activeClass : inactiveClass}`}
									>
										{t('footer.login')}
									</Link>
									<Link
										to="/signup"
										className={`${linkBaseClass} ${isActive("/signup") ? activeClass : inactiveClass}`}
									>
										{t('footer.signup')}
									</Link>
								</>
							) : (
								<>
									<Link
										to="/profile"
										className={`${linkBaseClass} ${isActive("/profile") ? activeClass : inactiveClass}`}
									>
										{t('navigation.profile')}
									</Link>
									<Link
										to="/logout"
										className={`${linkBaseClass} ${isActive("/logout") ? activeClass : inactiveClass}`}
									>
										{t('navigation.logout')}
									</Link>
								</>
							)}
							<select
								value={i18n.language}
								onChange={e => changeLanguage(e.target.value)}
								className="bg-gray-100 text-gray-700 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#0861FF] text-sm"
								aria-label="Select language"
							>
								<option value="en">English</option>
								<option value="fr">Français</option>
							</select>
						</div>
					</div>
					<div className="lg:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-gray-700 hover:text-[#0861FF] focus:outline-none"
							aria-label="Toggle menu"
						>
							{isOpen ? (
								<FaTimes className="h-6 w-6" />
							) : (
								<FaBars className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{isOpen && (
				<div className="lg:hidden">
					<div className="space-y-1 px-2 pb-3 pt-2">
						<Link
							to="/"
							className={`${linkBaseClass} block ${isActive("/") ? activeClass : inactiveClass}`}
							onClick={() => setIsOpen(false)}
						>
							{t('footer.home')}
						</Link>
						<Link
							to="/auctions"
							className={`${linkBaseClass} block ${isActive("/auctions") ? activeClass : inactiveClass}`}
							onClick={() => setIsOpen(false)}
						>
							{t('footer.auctions')}
						</Link>
						<div className="pt-4 pb-3 border-t border-gray-200">
							{!isLoggedIn ? (
								<>
									<Link
										to="/login"
										className={`${linkBaseClass} block ${isActive("/login") ? activeClass : inactiveClass}`}
										onClick={() => setIsOpen(false)}
									>
										{t('footer.login')}
									</Link>
									<Link
										to="/signup"
										className={`${linkBaseClass} block ${isActive("/signup") ? activeClass : inactiveClass}`}
										onClick={() => setIsOpen(false)}
									>
										{t('footer.signup')}
									</Link>
								</>
							) : (
								<>
									<Link
										to="/profile"
										className={`${linkBaseClass} block ${isActive("/profile") ? activeClass : inactiveClass}`}
										onClick={() => setIsOpen(false)}
									>
										{t('navigation.profile')}
									</Link>
									<Link
										to="/logout"
										className={`${linkBaseClass} block ${isActive("/logout") ? activeClass : inactiveClass}`}
										onClick={() => setIsOpen(false)}
									>
										{t('navigation.logout')}
									</Link>
								</>
							)}
							<select
								value={i18n.language}
								onChange={e => changeLanguage(e.target.value)}
								className="mt-4 w-full bg-gray-100 text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0861FF] text-sm"
								aria-label="Select language"
							>
								<option value="en">English</option>
								<option value="fr">Français</option>
							</select>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
};

export default NavBar;
