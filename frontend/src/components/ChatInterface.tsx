"use client"
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

//import { getConversation, sendMessage, clearConversation } from "@/lib/action";

import { get } from "http";


export function getOppositeUser(user: User): User {
  return user === "doctor" ? "patient" : "doctor";
}

export type User = "patient" | "doctor";

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
  const [currentUser, setCurrentUser] = useState<User>("doctor");

  const switchUser = () => {
    setCurrentUser(getOppositeUser(currentUser));
    console.log("Switched user", currentUser);
  }

  const getMessageHistory = async () => {
    //const converation = await getConversation()
    //const messages = converation.map(convertToMessage);
    setMessages(messages);
  }

  const clearHistory = async () => {
    //await clearConversation();
    getMessageHistory();
  };  

  const onSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = event.currentTarget["message"].value
    event.currentTarget["message"].value = "";
    //await sendMessage(currentUser, getOppositeUser(currentUser), message);
    await getMessageHistory();
  }

  useEffect(() => {
    //getMessageHistory();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold leading-6 text-gray-900">
          Chatting
        </h2>

        <div className="flex gap-3">
          <button onClick={clearHistory}>
            Clear History
          </button>
          <button onClick={switchUser}>
            Switch User
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-gray-100 lg:fixed lg:bottom-32 lg:right-100 lg:top-28 lg:w-7/12 lg:overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className="p-3">
              <p className="text-md">
                <span className={`font-semibold capitalize ${message.user == "doctor" ? "text-blue-600" : "text-slate-900"}`}>{message.user}: </span>
                {message.text}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={onSubmitMessage}>
          <div className="lg:fixed lg:bottom-20 lg:w-7/12">
            <div className="col-span-full">
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  name="message"
                  id="message"
                  autoComplete="off"
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
                <button>
                  <ArrowRightIcon className="h-6 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}