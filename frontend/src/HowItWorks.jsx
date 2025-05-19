import React from 'react';
import { Search, Camera, HelpCircle } from 'lucide-react'; // optional icons

const features = [
  {
    title: 'Fast Image Recognition',
    desc: 'Upload a photo of your pill or use your camera to instantly identify medications with our advanced AI',
    icon: <Camera className="w-10 h-10 text-blue-400" />,
  },
  {
    title: 'Detailed Manual Search',
    desc: 'Enter pill characteristics like shape, color, imprint, and size for accurate identification when an image isn’t available',
    icon: <Search className="w-10 h-10 text-blue-400" />,
  },
  {
    title: 'Smart AI Assistant',
    desc: 'Ask questions about your medication to get reliable information about usage, side effects, and interactions',
    icon: <HelpCircle className="w-10 h-10 text-blue-400" />,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-gray-50 text-gray-800 py-24 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">How EZ-Rx-ID Works</h2>
      <div className="container mx-auto grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-lg"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
