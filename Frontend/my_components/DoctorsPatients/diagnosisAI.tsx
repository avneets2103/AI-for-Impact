import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/Interfaces";
import { Button, Input } from "@nextui-org/react";
import { FLASK_SERVER } from "@/CONSTANTS";
import axios from "axios";
import Loader from "@/components/ui/Loader";
/**
 * The SupportHero component is a self-contained component that displays a chat interface with the user and the AI.
 * It handles user input, sending messages, and displaying the conversation.
 *
 * @returns {JSX.Element} The SupportHero component.
 */

interface Props{
  id: string;
}
function DiagnosisAI({id}: Props) {
  /**
   * The conversation state is an array of messages.
   * Each message is an object with a text and a sender.
   */
  const [conversation, setConversation] = useState<Message[]>([
    { text: "Hey, how can I help you?", sender: "not_user" },
  ]);
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

  /**
   * The chatBodyRef is a reference to the chat body element.
   * It is used to scroll the chat body to the bottom when a new message is added.
   */
  const chatBodyRef = useRef<HTMLDivElement>(null);

  /**
   * The inputText state is the text that the user has typed in the input field.
   */
  const [inputText, setInputText] = useState<string>("");
  const [context, setContext] = useState("");
  /**
   * The handleSendMessage function is called when the user clicks the send button or presses enter.
   * It adds a new message to the conversation state and scrolls the chat body to the bottom.
   */
  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;
    const newMessage: Message = { text: inputText.trim(), sender: "user" };
    setConversation((prev) => [...prev, newMessage]);
    setWaitForRes(true);
    setInputText("");

    try{
      const res = await axios.post(`${FLASK_SERVER}/doctorChat/chat`, {
        prompt: inputText,
        context: context,
        patientId: id
      });
      
      // Update context with the new context from response
      setContext(res.data.newContext);
      
      // Create the new message object for the bot response
      const newMessage2: Message = { text: formatTextAsHTML(res.data.response), sender: "not_user"};

      // Add bot response to the conversation without overwriting
      setConversation((prev) => [...prev, newMessage2]);
    } catch (error){
      console.log("Error in sending message to the server: ", error);
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

  const [waitForRes, setWaitForRes] = useState(false);
  return (
    <div className="flex flex-col justify-between bg-color1 m-0 p-0 h-full">
      <div
        ref={chatBodyRef}
        className="flex h-[70vh] max-h-[70vh] my-2 flex-col overflow-y-scroll p-[15px] text-textColorDark"
      >
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
      <div className="flex flex-col items-center p-[10px] -pb-[10px] pr-0">
        <div className="w-[100%] p-1 flex flex-row justify-between items-center px-1">

          <Input
            color={waitForRes?"warning":"primary"}
            disabled={waitForRes}
            type="text"
            placeholder={waitForRes?"Waiting for response...":"Type a message..."}
            value={inputText}
            className="mr-4"
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleEnter}
          />
          <button
            className={
              waitForRes
                ? "bg-warning text-white h-10 w-10 rounded-full"
                : "bg-primaryColor text-white h-10 w-10 rounded-full"
            }
            onClick={handleSendMessage}
          >
            {waitForRes ? "◼" : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisAI;
