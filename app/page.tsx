"use client"

import { useState } from "react"

const Page = () => {
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
      method: "POST",
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.content);

    setMessages((prevMessages) => [...prevMessages, output]);
    setIsLoading(false);

  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 py-5">
      <h1 className="text-5xl font-sans">TutorBot</h1>
      <div className="flex  h-[35rem] w-[40rem] flex-col items-center bg-gray-600 rounded-xl">
        <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
          <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
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
            {isLoading ? <div className="self-start  bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min">*thinking*</div> : ""}
          </div>
        </div>
        <div className="relative  w-[80%] bottom-4 flex justify-center">
          <textarea value={theInput} onChange={(event) =>
            setTheInput(event.target.value)} className="w-[85%] h-10 px-3 py-2
          resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none"
            onKeyDown={handleEnterKey} />
          <button
            onClick={getResponseAction}
            className="w-[15%] bg-blue-500 px-4 py-2 rounded-r"
          >
            send
          </button>
        </div>
      </div>

      <div></div>
    </main>
  );
}

export default Page