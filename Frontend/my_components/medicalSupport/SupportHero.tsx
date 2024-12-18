import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/Interfaces";
import { Button, Input } from "@nextui-org/react";
import axios from "@/utils/axios";
import Loader from "@/components/ui/Loader"; // Assuming your Loader component is in this path
import { BACKEND_URI } from "@/CONSTANTS";
import { ToastErrors } from "@/Helpers/toastError";
function SupportHero() {
  const formatTextAsHTML = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')   // Convert **text** to <strong>text</strong>
      .replace(/^\*\s(.+)$/gm, '• $1')                    // Convert lines starting with * to bullet points
      .replace(/\b([^:\s]+):\s/g, '<strong>$1:</strong>') // Bold text before colons
      .replace(/\n/g, '<br>')                             // Convert newlines to <br> tags
      .replace(/(^|\n)(\d+)\.\s(?!\d{1,2}\/\d{1,2}\/\d{2,4})/g, '<br>$2. ') // Add line breaks for numbered lists, exclude dates
      .replace(/\n\s*[-]\s/g, '<br>• ')                   // Add line breaks and bullets for lists with dashes
      .replace(/\n{2,}/g, '<br><br>');                    // Convert multiple newlines to <br><br>
  };

  const [conversation, setConversation] = useState<Message[]>([
    { text: "Hey, how can I help you?", sender: "not_user" },
  ]);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState<string>("");
  const [waitForRes, setWaitForRes] = useState(false); // Loader state
  const [context, setContext] = useState(".");

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const newMessage: Message = { text: inputText.trim(), sender: "user" };

    // Add user message to the conversation
    setConversation((prev) => [...prev, newMessage]);
    setWaitForRes(true);  // Show loader
    setInputText("");
    
    try {
      const res = await axios.post(`${BACKEND_URI}/patient/chat`, {
        prompt: inputText,
        context: context,
      });
      setContext(res.data.data.newContext);

      const newMessage2: Message = { text: formatTextAsHTML(res.data.data.response), sender: "not_user" };
      setConversation((prev) => [...prev, newMessage2]);
    } catch (error) {
      console.error("Error sending messages:", error);
    } finally {
      setWaitForRes(false);  // Hide loader when done
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="flex h-[80vh] flex-col bg-color1 rounded-xl">
      <p className="my-3 flex items-center justify-center font-medium gap-1">
        <img src="/icons/aiGenerated.png" alt="" className="w-[20px] h-[20px]" />
        AI Powered HealthChat
      </p>
      <div ref={chatBodyRef} className="flex h-[60vh] flex-col overflow-y-scroll p-[15px] text-textColorDark">
        {conversation.map((message, index) => (
          <div
          key={index}
          className={
            message.sender === "user"
              ? "mb-[10px] flex self-end rounded-[10px] bg-color2 px-[10px] py-[8px] max-w-[70%]"
              : "bg-lowContrastColor mb-[10px] flex self-start rounded-[10px] px-[10px] py-[8px] max-w-[70%]"
          }
        >
          {message.sender === "user" ? (
            <span>{message.text}</span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: message.text }} />
          )}
        </div>
        
        ))}

        {waitForRes && (
          <div className="flex justify-center items-center">
            <Loader /> {/* Display loader while waiting for response */}
          </div>
        )}
      </div>
      <div className="flex flex-col sticky bottom-0 items-center p-[10px] pr-0 ">
        <div className="w-[100%] p-1 flex gap-1">
          <Input
            variant="underlined"
            color={waitForRes ? "warning" : "primary"}
            disabled={waitForRes}
            type="text"
            placeholder={waitForRes ? "Waiting for response..." : "Type a message..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleEnter}
          />
          <button
            className={waitForRes ? "h-10 w-10 text-warning" : "h-10 w-10 text-primaryColor"}
            onClick={handleSendMessage}
          >
            {waitForRes ? "◼" : "➤"}
          </button>
        </div>
        <div className="flex gap-2 self-end p-2 px-5">
          <Button color="danger" onPress={() => { window.location.href = "tel:102" }}>
            Call Ambulance
          </Button>
          <Button className="bg-primaryColor text-[whitesmoke]" onClick={async () => {
            const dateTime = new Date().toLocaleString();
            let newReport = dateTime + ": ";
            for (let i = 0; i < conversation.length; i++) {
              newReport += conversation[i].sender + ": ";
              newReport += conversation[i].text;
              newReport += "\n";
            }
            try {
              axios.post(`${BACKEND_URI}/patient/addChatReport`, {
                reportDate: dateTime,
                reportPDFText: newReport,
              });
              setContext("");
              setConversation([{ text: "Hey, how can I help you?", sender: "not_user" }]);
              setInputText("");
            } catch (error) {
              ToastErrors("Error saving report");
            }
          }}>
            End Chat
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SupportHero;
