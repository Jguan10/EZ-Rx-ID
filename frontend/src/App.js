import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import PillResults from "./pages/PillResults";
import Chat from './pages/Chat';
import Footer from './Footer';



function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pill-results" element={<PillResults />} />
          <Route path="/chat" element={<Chat />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
