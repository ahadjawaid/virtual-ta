import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import "./ChatInterface.css";

export function getOppositeUser(user: User): User {
  return user === "TA" ? "student" : "TA";
}

export type User = "student" | "TA";

export type Message = {
  user: User;
  text: string;
};

function convertToMessage(data: any): Message {
  return {
    user: data.sender_id,
    text: data.message,
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);

  const onSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageText = event.currentTarget["message"].value;
    event.currentTarget["message"].value = "";
  
    // Add the submitted message to the messages state
    setMessages(prevMessages => [
      ...prevMessages,
      { user: "student", text: messageText }
    ]);
  
    // Extract the course ID from the URL
    const url = window.location.href;
    const courseId = url.substring(url.lastIndexOf("/") + 1);
    
    try {
      // Send a POST request to the endpoint with the message text
      const response = await fetch(`http://127.0.0.1:8000/chat/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: messageText })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Get the response data
      const responseData = await response.json();
      console.log(responseData);
      // Add the actual response from the backend to the messages state
      setMessages(prevMessages => [
        ...prevMessages,
        { user: "TA", text: responseData.result }
      ]);
    } catch (error) {
      console.error("Error:", error);
  
      // Add an error message to the messages state
      setMessages(prevMessages => [
        ...prevMessages,
        { user: "TA", text: "An error occurred while processing your request." }
      ]);
    }
  };

  return (
    <>
      <div className='chat-container'>
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold leading-6 text-gray-900">
            Virtual TA
          </h2>
        </div>
      <div className="form-container bg-gray-300 lg:fixed lg:bottom-32 lg:right-100 lg:top-28 lg:w-8/12 lg:overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="p-3">
            <p className="text-md">
              <span className={`font-semibold capitalize ${message.user === "TA" ? "text-blue-600" : "text-slate-900"}`}>{message.user}: </span>
              {message.text}
            </p>
          </div>
        ))}
         <div className="submit-bar">
          <form onSubmit={onSubmitMessage}>
            <div className="lg:fixed lg:bottom-20 lg:w-8/12">
              <div className="col-span-full">
                <div className="flex">
                  <input
                    type="text"
                    name="message"
                    id="message"
                    autoComplete="off"
                    className="input-bar"
                  />
                  <button>
                    <ArrowRightIcon className="h-6 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}
