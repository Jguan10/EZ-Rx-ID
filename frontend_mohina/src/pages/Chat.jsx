import React, { useState, useRef, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate API error reply for now
    const botMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="px-4 mt-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 h-[calc(100vh-8rem)] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="text-red-500 mr-2">❓</span> Medication Questions
        </h2>
  
        <p className="bg-gray-100 text-sm text-gray-700 px-4 py-3 rounded mb-4">
          You can ask questions about identified medications. For example: <strong>'What are the side effects of Lipitor?'</strong>
        </p>
  
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 text-right text-sm text-blue-800'
                    : 'bg-gray-200 text-sm text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
  
          <div ref={messagesEndRef} />
        </div>
  
        <div className="mt-4 flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about this medication..."
            className="flex-1 px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-full hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
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

      <div className="text-center text-xs text-gray-500 mt-2 space-y-1">
        <p>Disclaimer: EZ-Rx-ID is designed to help identify medications but should not replace professional medical advice.</p>
        <p>Always consult a healthcare provider or pharmacist for medical questions.</p>
      </div>


    </div>
  );
  
};

export default Chat;

