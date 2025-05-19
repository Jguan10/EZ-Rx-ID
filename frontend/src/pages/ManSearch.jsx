import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const ManSearch = () => {
  const [color, setColor] = useState('');
  const [shape, setShape] = useState('');
  const [imprint, setImprint] = useState('');
  const [colorOptions, setColorOptions] = useState([]);
  const [shapeOptions, setShapeOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShapesAndColors = async () => {
      try {
        const { data, error } = await supabase
          .from('pill_data')
          .select('shape, color')
          .not('shape', 'is', null)
          .not('color', 'is', null);

        if (error) throw error;

        console.log('[DEBUG] Raw data from Supabase:', data);

        const uniqueShapes = [...new Set(
          data.map(item => item.shape?.trim().toUpperCase()).filter(Boolean)
        )];
        const uniqueColors = [...new Set(
          data.map(item => item.color?.trim().toUpperCase()).filter(Boolean)
        )];

        setShapeOptions(uniqueShapes);
        setColorOptions(uniqueColors);
      } catch (error) {
        console.error('Error fetching shapes and colors:', error.message);
      }
    };

    fetchShapesAndColors();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();
    if (color) queryParams.append('color', color);
    if (shape) queryParams.append('shape', shape);
    if (imprint) queryParams.append('imprint', imprint);

    console.log('[DEBUG] Navigating with query:', queryParams.toString());
    navigate(`/pill-results?${queryParams.toString()}`);
  };

  return (
    <form id="manualForm" onSubmit={handleSubmit} className="space-y-6 px-2 text-sm">

      {/* Pill Color */}
      <div>
        <label htmlFor="color" className="block font-medium text-gray-700 mb-1">Pill Color</label>
        <select
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Color</option>
          {colorOptions.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Pill Shape */}
      <div>
        <label htmlFor="shape" className="block font-medium text-gray-700 mb-1">Pill Shape</label>
        <select
          id="shape"
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Shape</option>
          {shapeOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Pill Imprint */}
      <div>
        <label htmlFor="imprint" className="block font-medium text-gray-700 mb-1">Pill Imprint</label>
        <input
          type="text"
          id="imprint"
          value={imprint}
          onChange={(e) => setImprint(e.target.value)}
          placeholder="Optional - e.g. A123"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter imprints exactly as they appear, separated by a semicolon if on different sides.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default ManSearch;