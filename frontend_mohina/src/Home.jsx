import React, { useState } from 'react';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import ImgSearch from './pages/ImgSearch';
import ManSearch from './pages/ManSearch';

const Home = () => {
  const [activeTab, setActiveTab] = useState('image');

  return (
    <>
      <Hero />
      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="search-section" className="bg-gray-50 py-16 px-4">
        {/* Heading outside the white box */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Identify Your Medication</h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Upload an image or enter pill details to identify your medication quickly and accurately
          </p>
        </div>

        {/* Card-style tabbed search box */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-6 py-2 rounded-l-full font-semibold transition ${
                activeTab === 'image'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Image Upload
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-2 rounded-r-full font-semibold transition ${
                activeTab === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Manual Entry
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === 'image' ? <ImgSearch /> : <ManSearch />}
          </div>
        </div>
        
        {/* Show results button */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            form={activeTab === 'image' ? 'imageUploadForm' : 'manualForm'}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Show Results
          </button>
        </div>

        {/* Trusted info section */}
        <div className="mt-12 text-center">
          <h3 className="text-3xl font-bold text-gray-800">Trusted Information</h3>
          <p className="text-lg text-gray-500 mt-1 max-w-2xl mx-auto">
            Our database of medical information is sourced directly from FDA and verified pharmaceutical databases.
          </p>
        </div>

        {/* Separator line */}
        <hr className="border-t border-gray-300 my-8 w-full max-w-2xl mx-auto" />



        {/* Disclaimer section */}
        <div className="text-center text-sm text-gray-500 mt-8 space-y-1">
          <p>Disclaimer: EZ-Rx-ID is designed to help identify medications but should not replace professional medical advice.</p>
          <p>Always consult a healthcare provider or pharmacist for medical questions.</p>
        </div>
      </section>
    </>
  );
};

export default Home;
