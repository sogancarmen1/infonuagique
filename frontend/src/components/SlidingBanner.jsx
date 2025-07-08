import { motion } from "framer-motion";

const SlidingBanner = () => {
  const variants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 15,
          ease: "linear"
        }
      }
    }
  };

  const items = [
    "⚡ Instant Bidding",
    "🧠 Smart Strategy",
    "🔒 Secure Payments",
    "🏆 Win Big",
    "📈 Real-time Updates",
  ];

  return (
    <div className="overflow-hidden w-full bg-gradient-to-br from-blue-700 to-blue-900 py-4">
      <motion.div
        className="flex gap-12 text-white text-xl font-semibold whitespace-nowrap"
        variants={variants}
        animate="animate"
      >
        {items.concat(items).map((item, index) => (
          <div key={index} className="px-4">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SlidingBanner;
