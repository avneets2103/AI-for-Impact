import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/Interfaces";
import { Button, Input } from "@nextui-org/react";
import axios from "@/utils/axios";
import { BACKEND_URI, FLASK_SERVER } from "@/CONSTANTS";

/**
 * The SupportHero component is a self-contained component that displays a chat interface with the user and the AI.
 * It handles user input, sending messages, and displaying the conversation.
 *
 * @returns {JSX.Element} The SupportHero component.
 */
function SupportHero() {
  /**
   * The conversation state is an array of messages.
   * Each message is an object with a text and a sender.
   */
  const cleanTextForDisplay = (text:string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold** markers
      .replace(/\n+/g, ' ');  // Replace newlines with a single space
  };
  
  const [conversation, setConversation] = useState<Message[]>([
    { text: "Hey, how can I help you?", sender: "not_user" },
  ]);

  /**
   * The chatBodyRef is a reference to the chat body element.
   * It is used to scroll the chat body to the bottom when a new message is added.
   */
  const chatBodyRef = useRef<HTMLDivElement>(null);

  /**
   * The inputText state is the text that the user has typed in the input field.
   */
  const [inputText, setInputText] = useState<string>("");
  const [waitForRes, setWaitForRes] = useState(false);
  const [context, setContext] = useState("");

  /**
   * The handleSendMessage function is called when the user clicks the send button or presses enter.
   * It adds a new message to the conversation state and scrolls the chat body to the bottom.
   */
  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;
    
    const newMessage: Message = { text: inputText.trim(), sender: "user" };
    
    // Add user message to the conversation
    setConversation((prev) => [...prev, newMessage]);
    setWaitForRes(true);
    setInputText("");
  
    try {
      const res = await axios.post(`${FLASK_SERVER}/patientChat/chat`, {
        prompt: inputText,
        context: context,
      });
      
      // Update context with the new context from response
      setContext(res.data.newContext);
      
      // Create the new message object for the bot response
      const newMessage2: Message = { text: cleanTextForDisplay(res.data.response), sender: "not_user" };
      
      // Add bot response to the conversation without overwriting
      setConversation((prev) => [...prev, newMessage2]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setWaitForRes(false);
    }
  };
  

  /**
   * The handleEnter function is called when the user presses enter.
   * It calls the handleSendMessage function.
   */
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  /**
   * The useEffect hook is used to scroll the chat body to the bottom when a new message is added.
   */
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="flex max-h-[80vh] flex-col bg-color1">
      <p className="my-3 flex items-center justify-center font-medium gap-1">
        <img src="/icons/aiGenerated.png" alt="" className="w-[20px] h-[20px]"/>
        AI Powered HealthChat
      </p>
      <div
        ref={chatBodyRef}
        className="flex max-h-[60vh] flex-col overflow-y-scroll p-[15px] text-textColorDark h-[60vh]"
      >
        {conversation.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === "user"
                ? "mb-[10px] flex self-end rounded-[10px] bg-color2 p-[10px] max-w-[70%]"
                : "bg-lowContrastColor mb-[10px] flex self-start rounded-[10px] p-[10px] max-w-[70%]"
            }
          >
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center p-[10px] pr-0">
        <div className="w-[100%] p-1 flex gap-1">
          <Input
            variant="underlined"
            color={waitForRes?"warning":"primary"}
            disabled={waitForRes}
            type="text"
            placeholder={waitForRes?"Waiting for response...":"Type a message..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleEnter}
          />
          <button
            className={
              waitForRes ? " h-10 w-10 text-warning " : "h-10 w-10 text-primaryColor"
            }
            onClick={handleSendMessage}
          >
            {waitForRes ? "◼" : "➤"}
          </button>
        </div>
        <div className="flex gap-2 self-end p-2 px-5">
          <Button color="danger" onPress={()=>{
            window.location.href = "tel:102"
          }}>
            Call Ambulance
          </Button>
          <Button className="bg-primaryColor text-[whitesmoke]"
          onClick={async()=>{
            const dateTime = new Date().toLocaleString();
            let newReport = dateTime + ": ";
            for(let i = 0; i < conversation.length; i++){
              newReport += conversation[i].sender + ": ";
              newReport += conversation[i].text;
              newReport += "\n";
            }
            axios.post(`${BACKEND_URI}/patient/addChatReport`, {
              reportDate: dateTime,
              reportPDFText: newReport,
            });
            setContext("");
            setConversation([
              { text: "Hey, how can I help you?", sender: "not_user" },
            ]);
            setInputText("");
          }}
          >
            End Chat
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SupportHero;
