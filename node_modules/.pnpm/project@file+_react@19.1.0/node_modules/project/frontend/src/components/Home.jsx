import PropTypes from "prop-types";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGavel, FaLightbulb, FaCogs, FaUserPlus, FaHandPointer, FaTrophy, FaArrowDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import SlidingBanner from "./SlidingBanner";
import Footer from "./Footer";	
import { useRef } from "react";

const Home = () => {
	const { t } = useTranslation();
	const howItWorksRef = useRef(null);
	const { scrollYProgress } = useScroll();
	const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

	const scrollToHowItWorks = () => {
		howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="min-h-screen bg-white">
			<div className="relative bg-[#0861FF] text-white w-full overflow-hidden">
				<div className="absolute inset-0 w-full h-full">
					<video
						ref={(el) => {
							if (el) {
								el.playbackRate = 1.0;
							}
						}}
						autoPlay
						loop
						muted
						playsInline
						preload="auto"
						disablePictureInPicture
						disableRemotePlayback
						className="absolute w-full h-full object-cover opacity-40 transition-opacity duration-1000"
						onError={(e) => console.error("Error loading video:", e)}
						onLoadedData={(e) => e.target.play()}
						onTimeUpdate={(e) => {
							if (e.target.currentTime >= e.target.duration - 0.1) {
								e.target.currentTime = 0;
							}
						}}
					>
						<source src="/videos/hero-background.mp4" type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<div className="absolute inset-0 bg-gradient-to-b from-[#0861FF]/60 via-[#0861FF]/50 to-[#0861FF]/70"></div>
				</div>

				<div className="absolute inset-0 overflow-hidden mix-blend-overlay">
					<motion.div
						className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl"
						animate={{
							x: [0, 100, 0],
							y: [0, 50, 0],
							scale: [1, 1.1, 1],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "linear"
						}}
						style={{
							top: "10%",
							left: "10%",
						}}
					/>
					<motion.div
						className="absolute w-72 h-72 rounded-full bg-white/10 blur-3xl"
						animate={{
							x: [0, -100, 0],
							y: [0, -50, 0],
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: 15,
							repeat: Infinity,
							ease: "linear"
						}}
						style={{
							top: "60%",
							right: "10%",
						}}
					/>

					<div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 mix-blend-overlay">
						<motion.div
							className="absolute inset-0"
							animate={{
								backgroundPosition: ["0% 0%", "100% 100%"],
								opacity: [0.05, 0.1, 0.05],
							}}
							transition={{
								duration: 20,
								repeat: Infinity,
								ease: "linear"
							}}
						/>
					</div>

					<div className="absolute inset-0">
						{[...Array(30)].map((_, i) => (
							<motion.div
								key={i}
								className="absolute w-1 h-1 bg-white/40 rounded-full"
								animate={{
									y: [0, -100],
									opacity: [0, 0.8, 0],
									scale: [0, 1, 0],
								}}
								transition={{
									duration: Math.random() * 3 + 2,
									repeat: Infinity,
									delay: Math.random() * 2,
									ease: "linear"
								}}
								style={{
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
								}}
							/>
						))}
					</div>

					<div className="absolute inset-0">
						{[...Array(15)].map((_, i) => (
							<motion.div
								key={`sparkle-${i}`}
								className="absolute w-2 h-2 bg-white/50"
								style={{
									clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
								}}
								animate={{
									rotate: [0, 360],
									opacity: [0, 0.8, 0],
									scale: [0, 1, 0],
								}}
								transition={{
									duration: Math.random() * 4 + 3,
									repeat: Infinity,
									delay: Math.random() * 3,
									ease: "linear"
								}}
							/>
						))}
					</div>

					<div className="absolute inset-0">
						<motion.div
							className="absolute w-full h-32 bg-white/10"
							style={{
								bottom: 0,
								clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 75% 50%, 50% 0%, 25% 50%, 0% 0%)",
							}}
							animate={{
								opacity: [0.1, 0.2, 0.1],
								scaleY: [1, 1.1, 1],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: "easeInOut"
							}}
						/>
					</div>

					<div className="absolute inset-0">
						{[...Array(10)].map((_, i) => (
							<motion.div
								key={`line-${i}`}
								className="absolute h-px bg-white/30"
								style={{
									width: `${Math.random() * 100 + 50}px`,
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
									transform: `rotate(${Math.random() * 360}deg)`,
								}}
								animate={{
									x: [0, Math.random() * 100 - 50],
									y: [0, Math.random() * 100 - 50],
									opacity: [0, 0.6, 0],
								}}
								transition={{
									duration: Math.random() * 5 + 5,
									repeat: Infinity,
									delay: Math.random() * 2,
									ease: "linear"
								}}
							/>
						))}
					</div>

					<div className="absolute inset-0">
						{[...Array(3)].map((_, i) => (
							<motion.div
								key={`ring-${i}`}
								className="absolute border border-white/20 rounded-full"
								style={{
									width: "100%",
									height: "100%",
									left: "50%",
									top: "50%",
									transform: "translate(-50%, -50%)",
								}}
								animate={{
									scale: [1, 1.2, 1],
									opacity: [0.1, 0, 0.1],
								}}
								transition={{
									duration: 4,
									repeat: Infinity,
									delay: i * 1.3,
									ease: "easeInOut"
								}}
							/>
						))}
					</div>
				</div>

				<motion.div 
					style={{ opacity, scale }}
					className="container mx-auto px-container-padding py-8 xs:py-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:space-x-12 relative z-10"
				>
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
					>
						<h1 className="mt-4 text-display-2 xs:text-display-1 font-extrabold text-white leading-tight tracking-tight font-['Poppins']">
							<span className="block text-4xl sm:text-5xl md:text-6xl font-['Outfit'] font-light tracking-wide mb-2">
								Welcome to
							</span>
							<span className="block text-5xl sm:text-6xl md:text-7xl font-['Outfit'] font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
								Our Online
							</span>
							<span className="block text-5xl sm:text-6xl md:text-7xl font-['Outfit'] font-bold">
								Bidding System
							</span>
						</h1>
						<p className="mt-6 max-w-xl text-lg text-gray-200 leading-relaxed">
							{t('intro')}
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
							<motion.a
								href="/auctions"
								className="group relative inline-block px-8 py-4 text-lg font-bold text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-400/50 transition-all duration-300"
								aria-label={t('view_auctions')}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<span className="relative z-10">{t('view_auctions')}</span>
								<span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
							</motion.a>
							<motion.button
								onClick={scrollToHowItWorks}
								className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-yellow-500 rounded-full shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transition-all duration-300"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{t('how_title')}
								<FaArrowDown className="ml-2 animate-bounce" />
							</motion.button>
						</div>
						<div className="mt-8 flex gap-4 justify-center lg:justify-start">
							<div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
								<span className="text-yellow-400 font-bold">+1200</span> {t('stats.active_auctions')}
							</div>
							<div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
								<span className="text-green-400 font-bold">98%</span> {t('stats.successful_bids')}
							</div>
						</div>
						<SlidingBanner />
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="lg:w-1/2 flex justify-center lg:justify-end"
						whileHover={{ scale: 1.02 }}
					>
						<div className="relative group">
							<img 
								src="/images/auction-hero.jpg" 
								alt="Auction illustration" 
								className="w-full max-w-md rounded-lg shadow-2xl object-cover transform transition-transform duration-300 group-hover:scale-105"
								style={{ maxHeight: '500px' }}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
						</div>
					</motion.div>
				</motion.div>
			</div>

			<section className="bg-white py-8 xs:py-12 w-full" role="region" aria-labelledby="features-heading">
				<div className="container mx-auto px-container-padding mt-12">
					<h2 id="features-heading" className="text-heading-1 font-bold text-center text-gray-800 mb-12 font-['Poppins']">{t('key_features')}</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						<FeatureCard
							title={t('features.live_title')}
							description={t('features.live_desc')}
							icon={<FaGavel className="text-blue-500 text-4xl" aria-hidden="true" />}
						/>
						<FeatureCard
							title={t('features.strategize_title')}
							description={t('features.strategize_desc')}
							icon={<FaLightbulb className="text-pink-500 text-4xl" aria-hidden="true" />}
						/>
						<FeatureCard
							title={t('features.manage_title')}
							description={t('features.manage_desc')}
							icon={<FaCogs className="text-green-500 text-4xl" aria-hidden="true" />}
						/>
					</div>
				</div>
			</section>

			<section ref={howItWorksRef} className="bg-gray-50 py-8 xs:py-12 w-full" role="region" aria-labelledby="how-it-works-heading">
				<div className="container mx-auto px-container-padding mt-12">
					<h2 id="how-it-works-heading" className="text-heading-1 font-bold text-center text-gray-800 mb-12 font-['Poppins']">{t('how_title')}</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
						<StepCard
							icon={<FaUserPlus className="text-4xl" aria-hidden="true" />}
							title={t('steps.signup_title')}
							description={t('steps.signup_desc')}
						/>
						<StepCard
							icon={<FaHandPointer className="text-4xl" aria-hidden="true" />}
							title={t('steps.bid_title')}
							description={t('steps.bid_desc')}
						/>
						<StepCard
							icon={<FaTrophy className="text-4xl" aria-hidden="true" />}
							title={t('steps.win_title')}
							description={t('steps.win_desc')}
						/>
					</div>
				</div>
			</section>

			<section className="bg-white py-8 xs:py-12 w-full" role="region" aria-labelledby="testimonials-heading">
				<div className="container mx-auto px-container-padding mt-12">
					<h2 id="testimonials-heading" className="text-heading-1 font-bold text-center text-gray-800 mb-12 font-['Poppins']">{t('testimonials.title')}</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<TestimonialCard
							name="John Doe"
							role={t('testimonials.regular_bidder')}
							content={t('testimonials.testimonial1')}
						/>
						<TestimonialCard
							name="Jane Smith"
							role={t('testimonials.auction_creator')}
							content={t('testimonials.testimonial2')}
						/>
						<TestimonialCard
							name="Mike Johnson"
							role={t('testimonials.collector')}
							content={t('testimonials.testimonial3')}
						/>
					</div>
				</div>
			</section>

			<Footer t={t} />
		</div>
	);
};

const FeatureCard = ({ title, description, icon }) => (
	<motion.div
		initial={{ opacity: 0, y: 50 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)" }}
		whileTap={{ scale: 0.97 }}
		className="p-6 xs:p-8 rounded-xl xs:rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 text-center text-gray-800"
		tabIndex={0}
		aria-label={title}
	>
		<div className="text-3xl xs:text-4xl mb-4 xs:mb-6 flex justify-center">
			{icon}
		</div>
		<h2 className="mb-3 xs:mb-4 text-heading-3 font-bold text-gray-800 text-center font-['Poppins']">{title}</h2>
		<p className="text-body text-gray-600 leading-relaxed text-center">{description}</p>
	</motion.div>
);

const StepCard = ({ icon, title, description }) => (
	<motion.div
		initial={{ opacity: 0, y: 50 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		className="bg-white p-6 text-center rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
	>
		<div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
			{icon}
		</div>
		<h3 className="text-heading-2 font-bold text-gray-800 mb-2 font-['Poppins']">{title}</h3>
		<p className="text-body text-gray-600">{description}</p>
	</motion.div>
);

const TestimonialCard = ({ name, role, content }) => (
	<motion.div
		initial={{ opacity: 0, y: 50 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
	>
		<div className="flex items-center mb-4">
			<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
				{name.charAt(0)}
			</div>
			<div className="ml-4">
				<h4 className="font-bold text-gray-800">{name}</h4>
				<p className="text-sm text-gray-600">{role}</p>
			</div>
		</div>
		<p className="text-gray-600 italic">&ldquo;{content}&rdquo;</p>
	</motion.div>
);

TestimonialCard.propTypes = {
	name: PropTypes.string.isRequired,
	role: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
};

FeatureCard.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	icon: PropTypes.element.isRequired,
};

StepCard.propTypes = {
	icon: PropTypes.element.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};

export default Home;