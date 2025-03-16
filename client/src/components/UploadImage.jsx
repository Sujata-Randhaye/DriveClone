import { useState, useEffect } from "react";
import axios from "axios";

const UploadImage = () => {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // For modal

    // Fetch user's images
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/images", { withCredentials: true });
                setImages(response.data.data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };
        fetchImages();
    }, []);

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!name.trim() || !image) {
            alert("Both name and image are required!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert(response.data.message);
            setImages([...images, response.data.data]); // Update UI
            setName("");
            setImage(null);
        } catch (error) {
            alert("Failed to upload image");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload an Image</h2>
            <form onSubmit={handleImageUpload} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Image Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="border p-2 rounded-lg focus:outline-none"
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold">
                    Upload Image
                </button>
            </form>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Uploaded Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((img) => (
                        <div 
                            key={img._id} 
                            className="relative group bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
                            onClick={() => setSelectedImage(`http://localhost:5000${img.imageUrl}`)}
                        >
                            <img 
                                src={`http://localhost:5000${img.imageUrl}`} 
                                alt={img.name} 
                                className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            <p className="text-center mt-2 text-gray-700 font-semibold">{img.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center" onClick={() => setSelectedImage(null)}>
                    <div className="relative animate-fadeIn">
                        <img src={selectedImage} alt="Full view" className="max-w-3xl max-h-screen rounded-lg shadow-lg" />
                        <button 
                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full text-lg shadow-md"
                            onClick={() => setSelectedImage(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadImage;
