import React, { useState, useRef, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch("https://5000-01jsfbc1mc3qvsswdep16mgbdv.cloudspaces.litng.ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input })
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      const botMessage = {
        sender: 'bot',
        text: data.answer || "Sorry, I couldn't find an answer.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        sender: 'bot',
        text: "⚠️ Error: Unable to get response from server.",
      }]);
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="px-4 mt-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 h-[calc(100vh-8rem)] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="text-red-500 mr-2">❓</span> Medication Questions
        </h2>

        <p className="bg-gray-100 text-sm text-gray-700 px-4 py-3 rounded mb-4">
          You can ask questions about identified medications. For example: <strong>'What are the side effects of Lipitor?'</strong>
        </p>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-2xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 text-right text-sm text-blue-800'
                    : 'bg-gray-200 text-sm text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="animate-spin w-6 h-6 border-4 border-blue-300 border-t-transparent rounded-full mt-2" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mt-4 flex">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            placeholder="Ask about this medication..."
            className="flex-1 px-5 py-2 h-12 rounded-l-full border border-gray-300 focus:outline-none resize-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-6 py-2 rounded-r-full hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* Trusted Info & Disclaimer */}
      <div className="mt-12 text-center">
        <h3 className="text-3xl font-bold text-gray-800">Trusted Information</h3>
        <p className="text-lg text-gray-500 mt-1 max-w-2xl mx-auto">
          Our database of medical information is sourced directly from FDA and verified pharmaceutical databases.
        </p>
      </div>

      <hr className="border-t border-gray-300 my-8 w-full max-w-2xl mx-auto" />

      <div className="text-center text-sm text-gray-500 mt-2 space-y-1">
        <p>Disclaimer: EZ-Rx-ID is designed to help identify medications but should not replace professional medical advice.</p>
        <p>Always consult a healthcare provider or pharmacist for medical questions.</p>
      </div>
    </div>
  );
};

export default Chat;
