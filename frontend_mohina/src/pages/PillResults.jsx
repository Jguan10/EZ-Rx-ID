import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const PillResults = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const selectedShape = params.get('shape');
  const selectedColor = params.get('color');
  const imprint = params.get('imprint');

  const [pillResults, setPillResults] = useState([]);

  useEffect(() => {
    setPillResults([
      {
        pill_name: 'Fentanyl 0.2 MG Oral Lozenge',
        confidence: 0.94,
        color: 'White',
        shape: 'BULLET',
        imprint: 'ACTIQ;200',
        dosage: '0.2 MG',
        rxnavImageFileName: 'pill1.jpg'
      },
      {
        pill_name: 'Lipitor 20 mg',
        confidence: 0.89,
        color: 'White',
        shape: 'OVAL',
        imprint: 'PD 155 20',
        dosage: '20 MG',
        rxnavImageFileName: 'pill2.jpg'
      },
      {
        pill_name: 'Ibuprofen 200 mg',
        confidence: 0.83,
        color: 'Orange',
        shape: 'ROUND',
        imprint: 'I2',
        dosage: '200 MG',
        rxnavImageFileName: 'pill3.jpg'
      }
    ])
    
}, []);


 {/* useEffect(() => {
    const fetchPills = async () => {
      try {
        let query = supabase.from('pill_data').select('*');

        if (selectedShape) query = query.eq('shape', selectedShape);
        if (selectedColor) query = query.eq('color', selectedColor);
        if (imprint) query = query.ilike('imprint', `%${imprint}%`);

        const { data, error } = await query;
        if (error) throw error;

        setPillResults(data);
      } catch (error) {
        console.error('Error fetching pills:', error.message);
      }
    };
    

    fetchPills();
  }, [selectedShape, selectedColor, imprint]);

    */}

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
            {pillResults.map((pill, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {pill.pill_name || 'Unknown Pill'}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Confidence: {(pill.confidence * 100 || 0).toFixed(2)}%
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <img
                    src={
                      pill.rxnavImageFileName
                        ? supabase.storage.from("pills").getPublicUrl(pill.rxnavImageFileName).data.publicUrl
                        : 'https://via.placeholder.com/100'
                    }
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
            ))}

            {/* New Search Button */}
            <div className="flex justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-medium text-sm hover:bg-blue-50 transition"
            >
              New Search
            </button>

            </div>
            {/* Ask About This Pill Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => window.location.href = '/chat'}
                className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-medium text-sm hover:bg-blue-50 transition"
              >
                Ask About This Pill
              </button>
            </div>
            <div className="text-center text-xs text-gray-500 mt-10 space-y-1">
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
