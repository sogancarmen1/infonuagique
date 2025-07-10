import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateAuctionItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimisticSuccess, setOptimisticSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOptimisticSuccess(false);
    // Optimistically show success and redirect
    setOptimisticSuccess(true);
    // We'll use a placeholder auctionId for optimistic redirect
    let optimisticAuctionId = null;
    setTimeout(() => {
      if (optimisticAuctionId) {
        navigate(`/auction/${optimisticAuctionId}`);
      }
    }, 700); // Short delay for user feedback
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startingBid", startingBid);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];
    if (token) {
      try {
        const response = await axios.post("/api/auctions", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        optimisticAuctionId = response.data._id;
        // If the server responds before the timeout, redirect immediately
        toast.success(t('auction.create_success') || 'Auction created! Redirecting...');
        navigate(`/auction/${optimisticAuctionId}`);
      } catch (err) {
        setOptimisticSuccess(false);
        setError(t('auction.error'));
        toast.error(t('auction.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 mx-auto animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-violet-700 mb-8 text-center drop-shadow-sm">
              {t('auction.create_title')}
            </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-1">
                  {t('auction.title')}
                </label>
                <input
                  id="title"
              name="title"
                  type="text"
              required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 shadow-inner transition-all duration-150"
              placeholder={t('auction.title_placeholder')}
                />
              </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-1">
                  {t('auction.description')}
                </label>
                <textarea
                  id="description"
              name="description"
              required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 shadow-inner transition-all duration-150 resize-none"
              placeholder={t('auction.description_placeholder')}
              rows={4}
                />
              </div>
          <div>
            <label htmlFor="startingBid" className="block text-sm font-medium text-gray-800 mb-1">
              {t('auction.starting_bid')}
                </label>
                <input
                  id="startingBid"
              name="startingBid"
                  type="number"
              min="0"
              required
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
              className="block w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 shadow-inner transition-all duration-150"
              placeholder={t('auction.starting_bid_placeholder')}
                />
              </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1" htmlFor="image">
              {t('auction.image')}
                </label>
            <div className="flex items-center gap-4">
              <label htmlFor="image" className="cursor-pointer inline-block px-5 py-2 rounded-full bg-violet-100 text-violet-700 font-semibold shadow hover:bg-violet-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400">
                {t('auction.choose_image')}
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {selectedImage && (
                <span className="text-gray-500 text-sm">{selectedImage.name}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">{t('auction.image_helper')}</p>
            {selectedImage && (
              <div className="mt-4 flex justify-center">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="max-h-40 rounded-lg shadow border border-gray-100 object-contain"
                />
              </div>
            )}
          </div>
          {error && (
            <div className="flex items-center text-red-500 text-sm mt-2">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}
          {optimisticSuccess && (
            <div className="flex items-center text-green-600 text-sm mt-2">
              <span className="mr-2">✔️</span> {t('auction.create_success') || 'Auction created! Redirecting...'}
            </div>
          )}
          <div>
              <button
                type="submit"
              className="w-full flex justify-center items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
              >
              {loading ? (
                <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>{t('auction.create_button')}...</span>
              ) : (
                t('auction.create_button')
              )}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionItem;
