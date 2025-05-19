import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const PillResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { search, state } = location;

  const params = new URLSearchParams(search);
  const selectedShape = params.get('shape');
  const selectedColor = params.get('color');
  const imprint = params.get('imprint');

  const [pillResults, setPillResults] = useState(state?.predictions || []);

    useEffect(() => {
  const fetchPills = async () => {
    try {
      // Check if predictions exist
      if (state?.predictions?.length > 0) {
        console.log('[DEBUG] Using predictions from state:', state.predictions);

        const predictedFilenames = state.predictions.map(p => `${p.pill_name}.jpg`);
        console.log('[DEBUG] Predicted filenames:', predictedFilenames);

        const { data, error } = await supabase
          .from('pill_data')
          .select('*')
          .in('rxnavImageFileName', predictedFilenames);

        console.log('[DEBUG] Supabase response (prediction query):', data);
        if (error) throw error;

        // Merge probabilities back into pill data
        const merged = predictedFilenames.map(name => {
          const pillData = data.find(p => p.rxnavImageFileName === name);
          const probability = state.predictions.find(p => `${p.pill_name}.jpg` === name)?.probability;
          return pillData ? { ...pillData, probability } : null;
        }).filter(Boolean);

        console.log('[DEBUG] Final merged pillResults:', merged);

        setPillResults(merged);
        return;
      }

      // If no predictions: manual search
      console.log('[DEBUG] No predictions found. Falling back to manual search.');
      let query = supabase.from('pill_data').select('*');
      if (selectedShape) {
        query = query.eq('shape', selectedShape);
        console.log('[DEBUG] Filtering by shape:', selectedShape);
      }
      if (selectedColor) {
        query = query.eq('color', selectedColor);
        console.log('[DEBUG] Filtering by color:', selectedColor);
      }
      if (imprint) {
        query = query.ilike('imprint', `%${imprint}%`);
        console.log('[DEBUG] Filtering by imprint (ILIKE):', imprint);
      }

      const { data, error } = await query;
      console.log('[DEBUG] Supabase response (manual query):', data);
      if (error) throw error;

      setPillResults(data);
    } catch (error) {
      console.error('❌ Error fetching pills:', error.message);
    }
  };

  fetchPills();
}, [state?.predictions, selectedShape, selectedColor, imprint]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Pill Search Results
      </h2>

      {pillResults.length === 0 ? (
        <p className="text-center text-gray-600">
          No pills found matching your search criteria.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {pillResults.map((pill, index) => {
              const imageUrl = pill.rxnavImageFileName
                ? supabase.storage.from("pills").getPublicUrl(pill.rxnavImageFileName).data.publicUrl
                : 'https://via.placeholder.com/100';

              return (
                <div key={index} className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {pill.pill_name || 'Unknown Pill'}
                  </h2>

                  {pill.probability !== undefined && (
                    <p className="text-gray-600 text-sm mb-4">
                      Confidence: {(pill.probability * 100).toFixed(2)}%
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-6">
                    <img
                      src={imageUrl}
                      alt={pill.pill_name}
                      className="w-32 h-32 object-contain border rounded bg-white"
                    />

                    <div className="flex-1 text-sm text-gray-700 space-y-2">
                      <p><strong>Color:</strong> {pill.color}</p>
                      <p><strong>Shape:</strong> {pill.shape}</p>
                      <p><strong>Imprint:</strong> {pill.imprint}</p>
                      <p><strong>Dosage:</strong> {pill.dosage}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* New Search Button */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-medium text-sm hover:bg-blue-50 transition"
              >
                New Search
              </button>
            </div>

            {/* Ask About This Pill Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate('/chat')}
                className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-medium text-sm hover:bg-blue-50 transition"
              >
                Ask About This Pill
              </button>
            </div>

            {/* Trusted info section */}
            <div className="mt-12 text-center">
              <h3 className="text-3xl font-bold text-gray-800">Trusted Information</h3>
              <p className="text-lg text-gray-500 mt-1 max-w-2xl mx-auto">
                Our database of medical information is sourced directly from FDA and verified pharmaceutical databases.
              </p>
            </div>

            {/* Separator */}
            <hr className="border-t border-gray-300 my-8 w-full max-w-2xl mx-auto" />

            <div className="text-center text-sm text-gray-500 mt-10 space-y-1">
              <p>Disclaimer: EZ-Rx-ID is designed to help identify medications but should not replace professional medical advice.</p>
              <p>Always consult a healthcare provider or pharmacist for medical questions.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PillResults;