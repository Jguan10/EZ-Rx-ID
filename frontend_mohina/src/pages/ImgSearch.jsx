import React, { useState } from 'react';
import supabase from '../supabaseClient';

const ImgSearch = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);

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
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const processedPredictions = data.predictions.map(p => ({
        ...p,
        probability: parseFloat(p.probability.replace("%", "")) / 100,
      }));

      const pillDetails = await fetchPillDetails(processedPredictions);
      setPredictions(pillDetails);
    } catch (error) {
      console.error("Error:", error);
      setPredictions([{ pill_name: "Error", probability: "N/A" }]);
    }
  };

  const fetchPillDetails = async (predictions) => {
    const predictedFilenames = predictions.map(p => `${p.pill_name}.jpg`);
    const { data, error } = await supabase
      .from("pill_data")
      .select("*")
      .in("rxnavImageFileName", predictedFilenames);

    if (error) {
      console.error("Error fetching pill details:", error);
      return predictions;
    }

    return predictions.map(prediction => {
      const pillData = data.find(p => p.rxnavImageFileName === `${prediction.pill_name}.jpg`);
      const imageUrl = pillData
        ? supabase.storage.from("pills").getPublicUrl(pillData.rxnavImageFileName).data.publicUrl
        : null;

      return {
        ...pillData,
        pill_name: prediction.pill_name,
        probability: prediction.probability,
        imageUrl,
      };
    });
  };

  return (
    <form id="imageUploadForm" onSubmit={handleSubmit} className="space-y-4">
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

  <div className="text-center text-sm text-gray-500">
    <p className="font-semibold text-gray-600 mb-1">For best results:</p>
    <ul className="flex flex-col items-center gap-0.5 leading-tight">
      <li>Use good lighting</li>
      <li>Place pill against a plain background</li>
      <li>Make sure imprints are visible</li>
    </ul>
  </div>

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
