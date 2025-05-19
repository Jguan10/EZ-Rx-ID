import React, { useState } from "react";

const PillUploader = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

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
      alert("Please select an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setPredictions([]);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPredictions(data.predictions); // fix: setPredictions instead of setPrediction
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Upload a Pill Image</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" style={styles.preview} />}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Predicting..." : "Submit"}
        </button>
      </form>

      {predictions.length > 0 && (
        <div style={styles.result}>
          <h3>Top Predictions:</h3>
          <ul>
            {predictions.map((pred, idx) => (
              <li key={idx}>
                {pred.label} ({(pred.probability * 100).toFixed(1)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  preview: {
    width: "200px",
    height: "auto",
    marginTop: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
  },
  result: {
    marginTop: "20px",
    textAlign: "left",
  },
};

export default PillUploader;
