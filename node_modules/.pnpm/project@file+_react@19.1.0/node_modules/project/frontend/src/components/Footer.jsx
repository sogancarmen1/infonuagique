import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

// Footer sections data
const footerSections = [
  {
    id: 1,
    section: "Platform",
    links: [
      { name: "Live Auctions", path: "/auctions" },
      { name: "Featured Items", path: "#" },
      { name: "Upcoming Sales", path: "#" },
      { name: "Bidding Guide", path: "#" }
    ]
  },
  {
    id: 2,
    section: "Support",
    links: [
      { name: "Help Center", path: "#" },
      { name: "Contact Support", path: "/contact" },
      { name: "Safety Tips", path: "#" },
      { name: "Report an Issue", path: "#" }
    ]
  },
  {
    id: 3,
    section: "Legal",
    links: [
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Service", path: "#" },
      { name: "Cookie Policy", path: "#" },
      { name: "User Agreement", path: "#" }
    ]
  },
  {
    id: 4,
    section: "Company",
    links: [
      { name: "About BidBud", path: "#" },
      { name: "Careers", path: "#" },
      { name: "Press Room", path: "#" },
      { name: "Success Stories", path: "#" }
    ]
  }
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8 gap-y-10 gap-x-8">
          {/* Company Info Column */}
          <div className="col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center lg:justify-start">
              <img src="/images/logo.png" alt="Platform Logo" className="h-28 w-auto" />
            </div>
            <p className="mt-2 text-gray-400 max-w-xs mx-auto lg:mx-0">
              Your trusted platform for online auctions. Discover unique items, place bids, and win amazing deals. Join thousands of satisfied buyers and sellers in our vibrant auction community.
            </p>
            <div className="mt-6 flex justify-center lg:justify-start space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          {/* Navigation Columns */}
          {footerSections.map((section) => (
            <div key={section.id} className="col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left">
              <h3 className="text-white text-lg font-semibold mb-4 mt-2 sm:mt-0">
                {section.section}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom Section */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BidBud. All rights reserved.
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <Link
              to="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 