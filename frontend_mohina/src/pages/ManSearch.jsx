import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const ManSearch = () => {
  const [color, setColor] = useState('');
  const [shape, setShape] = useState('');
  const [imprint, setImprint] = useState('');
  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShapesAndColors = async () => {
        try {
          const { data, error } = await supabase
            .from('pill_data')
            .select('shape, color')
            .not('shape', 'is', null)  // Exclude null values properly
            .not('color', 'is', null); // Exclude null values properly
      
          if (error) throw error;
      
          console.log("Raw data from Supabase:", data); // Debugging log
      
          // Ensure unique, trimmed, and uppercase values, while filtering out empty strings
          const uniqueShapes = [...new Set(
            data.map(item => item.shape?.trim().toUpperCase()).filter(Boolean)
          )];
      
          const uniqueColors = [...new Set(
            data.map(item => item.color?.trim().toUpperCase()).filter(Boolean)
          )];
      
          console.log("Processed Shapes:", uniqueShapes); // Debugging log
      
          setShape(uniqueShapes);
          setColor(uniqueColors);
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
    

    navigate(`/pill-results?${queryParams.toString()}`);
  };

  return (
    <form
      id="manualForm"
      onSubmit={handleSubmit}
      className="space-y-6 px-2 text-sm"
    >

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
          {['red', 'blue', 'black', 'gray', 'orange', 'yellow', 'turquoise', 'green', 'white', 'pink', 'brown', 'purple']
            .map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
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
          {[
            'BULLET', 'CAPSULE', 'DIAMOND', 'DOUBLE CIRCLE', 'FREEFORM',
            'HEXAGON', 'OCTAGON', 'OVAL', 'PENTAGON', 'RECTANGLE',
            'ROUND', 'SEMI-CIRCLE', 'SQUARE', 'TEAR', 'TRAPEZOID', 'TRIANGLE'
          ].map((shapeOption) => (
            <option key={shapeOption} value={shapeOption}>
              {shapeOption}
            </option>
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
          <span className="italic"> </span>
        </p>

      </div>


      

      {/* Submit */}
      
    </form>
  );
};

export default ManSearch;
