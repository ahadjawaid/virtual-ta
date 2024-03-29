"use client";
import React, { useState } from 'react';
import './Chatbot.css'; // Import CSS file for styling
import Sidebar from '@/components/Sidebar/Sidebar'
// Define the type for a message
type Message = {
  text: string;
  sender: 'user' | 'chatbot'; // Specify the sender type
};

// Define the component
const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); // Explicitly define the type of messages

  const sendMessage = () => {
    if (input.trim() === '') return;

    // Add user's message to the chat interface
    setMessages(prevMessages => [
      ...prevMessages,
      { text: input, sender: 'user' },
    ]);

    // Add "Message Received" response to the chat interface
    setMessages(prevMessages => [
      ...prevMessages,
      { text: 'Message Received', sender: 'chatbot' },
    ]);

    setInput(''); // Clear the input field
  };

  return (
    <>
    <div className="container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button className="chatbot-send" onClick={sendMessage}>Send</button>
    </div>
    </>
  );
};

export default Chatbot;
