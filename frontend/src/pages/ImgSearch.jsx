import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ImgSearch = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image); // <-- Change key from "file" to "image"

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Since backend probabilities are already floats, no need to parse or remove '%'
      const processedPredictions = data.predictions;

      const pillDetails = await fetchPillDetails(processedPredictions);
      setPredictions(pillDetails);

      navigate("/pill-results", {
        state: { predictions: pillDetails },
      });

    } catch (error) {
      console.error("Error:", error);
      alert("There was an error identifying the pill. Please try again.");
    }
  };

  const fetchPillDetails = async (predictions) => {
    const predictedFilenames = predictions.map(p => `${p.label}.jpg`);

    const { data, error } = await supabase
      .from("pill_data")
      .select("*")
      .in("rxnavImageFileName", predictedFilenames);

    if (error) {
      console.error("Error fetching pill details:", error);
      return predictions;
    }

    return predictions.map(prediction => {
      const pillData = data.find(p => p.rxnavImageFileName === `${prediction.label}.jpg`);
      const imageUrl = pillData
        ? supabase.storage.from("pills").getPublicUrl(pillData.rxnavImageFileName).data.publicUrl
        : null;

      return {
        ...pillData,
        pill_name: prediction.label,
        probability: prediction.probability,
        imageUrl,
      };
    });
  };

  return (
    <form id="imageUploadForm" onSubmit={handleSubmit} className="space-y-4">
      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }
        }}
        className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 pb-14 bg-gray-50 text-center transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:scale-[1.01] w-full max-w-4xl mx-auto"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="imageUpload"
        />

        <label
          htmlFor="imageUpload"
          className="cursor-pointer flex flex-col items-center justify-center space-y-2"
        >
          <img
            src="https://img.icons8.com/ios-filled/100/image.png"
            alt="Upload Icon"
            className="w-12 h-12 opacity-60"
          />
          <p className="text-gray-800 font-semibold text-sm">Upload Pill Image</p>
        </label>

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
          <label
            htmlFor="imageUpload"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium text-sm hover:bg-blue-700 cursor-pointer"
          >
            Browse Files
          </label>
        </div>
      </div>

      {/* Guide */}
      <div className="text-center text-sm text-gray-500">
        <p className="font-semibold text-gray-600 mb-1">For best results:</p>
        <ul className="flex flex-col items-center gap-0.5 leading-tight">
          <li>Use good lighting</li>
          <li>Place pill against a plain background</li>
          <li>Make sure imprints are visible</li>
        </ul>
      </div>

      {/* Preview Image */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-40 object-contain rounded-md border border-gray-300"
        />
      )}
    </form>
  );
};

export default ImgSearch;
