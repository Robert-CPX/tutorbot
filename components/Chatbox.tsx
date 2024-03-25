"use client"

import { useState } from "react"
import { toast } from "react-toastify";

const Chatbox = () => {
  const [theInput, setTheInput] = useState(""); // input that the user gives to the bot
  const [isLoading, setIsLoading] = useState(false); // a simple loading text to indicate that we are waiting for the bot to respond
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Yo, this is TutorBot! How can I help you today?",
    },
  ]);// it's an array of objects to help the chatbot keep track of the history of the conversation with a particular user.

  const handleEnterKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      getResponseAction();
    }
  };
  const getResponseAction = async () => {
    setIsLoading(true);
    let temp = messages;
    temp.push({ role: "user", content: theInput });
    setMessages(temp)
    setTheInput("");
    console.log("Calling OpenAI...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
        method: "POST",
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();
      const { output } = data;
      console.log("OpenAI replied...", output.content);
      setMessages((prevMessages) => [...prevMessages, output]);
      setIsLoading(false);
    } catch {
      toast.error("Failed to connect to the server.");
      setMessages((prevMessages) => [...prevMessages]);
      setIsLoading(false);
    }

  };
  return (
    <div className="flex md:absolute md:right-0 md:w-[28rem] max-md:w-full flex-col h-screen z-50 items-center bg-[rgba(0,0,0,0.5)]">
      <div className="h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
        {messages.map((e) => {
          return (
            <div
              key={e.content}
              className={`w-max max-w-[18rem] rounded-md px-4 py-3 h-min ${e.role === "assistant"
                ? "self-start  bg-gray-200 text-gray-800"
                : "self-end  bg-gray-800 text-gray-50"
                } `}
            >
              {e.content}
            </div>
          );
        })}
        {isLoading ? <div className="self-start bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min">*thinking*</div> : ""}
      </div>
      <div className="relative flex bottom-4">
        <textarea
          className="h-10 px-3 py-2 resize-none min-w-[16rem] overflow-y-auto text-black bg-gray-300 rounded-l outline-none"
          value={theInput}
          onChange={(event) => setTheInput(event.target.value)}
          onKeyDown={handleEnterKey} />
        <button onClick={getResponseAction} className="bg-blue-500 px-4 py-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  )
}

export default Chatbox
