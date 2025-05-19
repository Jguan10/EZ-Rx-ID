import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-sky-100 to-sky-500 text-white text-center py-14 px-4">
      <h1 className="text-5xl font-extrabold mb-4">EZ-Rx-ID</h1>
      <h2 className="text-2xl font-medium mb-4">Pill Identification Made Simple</h2>
      <p className="text-lg max-w-xl mx-auto mb-8">
        Identify medications by image or description using our advanced AI technology
      </p>
      <a
        href="#search-section"
        className="bg-white text-blue-600 font-semibold text-2xl px-8 py-3 rounded-full hover:bg-gray-100 transition"
      >
        Identify Now
      </a>
    </section>
  );
};

export default Hero;
