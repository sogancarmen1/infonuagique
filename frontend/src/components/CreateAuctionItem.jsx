import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateAuctionItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

        const auctionId = response.data._id;
        navigate(`/auction/${auctionId}`);
      } catch (err) {
        setError(t('auction.error'));
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-gray-300">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <h2 className="text-3xl font-extrabold text-white mb-6">
              {t('auction.create_title')}
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-lg font-medium text-gray-300 mb-1">
                  {t('auction.title')}
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-lg font-medium text-gray-300 mb-1">
                  {t('auction.description')}
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="startingBid" className="block text-lg font-medium text-gray-300 mb-1">
                  {t('auction.starting_bid')} ($)
                </label>
                <input
                  id="startingBid"
                  type="number"
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
                  min={0}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-lg font-medium text-gray-300 mb-1">
                  {t('auction.add_image')}
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-300 text-lg font-semibold"
              >
                {t('auction.create')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionItem;
