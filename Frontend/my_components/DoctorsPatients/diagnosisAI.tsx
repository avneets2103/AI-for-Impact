import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/Interfaces";
import { Button } from "@nextui-org/react";

/**
 * The SupportHero component is a self-contained component that displays a chat interface with the user and the AI.
 * It handles user input, sending messages, and displaying the conversation.
 *
 * @returns {JSX.Element} The SupportHero component.
 */
function DiagnosisAI() {
  /**
   * The conversation state is an array of messages.
   * Each message is an object with a text and a sender.
   */
  const [conversation, setConversation] = useState<Message[]>([
    {
      text: "A 22-year-old female patient presents with a palpable lump in her right breast, accompanied by nipple discharge and pain in the affected breast. Additionally, she reports swelling and redness in the right breast. These symptoms have been persistent and have prompted her to seek medical attention.",
      sender: "user",
    },
    {
      text: "Based on the symptoms, I'm considering a diagnosis of breast cancer. What do you think?",
      sender: "user",
    },
    {
      text: "I disagree, doctor. The patient's age and medical history suggest a low risk for breast cancer. Have you considered other possibilities, such as a breast abscess or mastitis?",
      sender: "not_user",
    },
    {
      text: "That's a good point, but the patient's symptoms persist despite her regular menstrual cycles and lack of recent infections. I still think breast cancer is a strong possibility.",
      sender: "user",
    },
    {
      text: "I understand your concern, doctor, but we should also consider the patient's family history. Although she has no known significant medical conditions, we should investigate further to rule out any genetic predispositions.",
      sender: "not_user",
    },
    {
      text: "I agree, let's order a genetic screening to assess her risk. However, I still believe breast cancer is a likely diagnosis. What about ordering a mammogram and ultrasound to confirm?",
      sender: "user",
    },
    {
      text: "I concur, doctor. A mammogram and ultrasound would provide valuable information. Additionally, we should also consider ordering a biopsy to confirm the diagnosis.",
      sender: "not_user",
    },
    {
      text: "Excellent suggestion, chatbot! Let's proceed with the biopsy and imaging tests. I'm confident that we'll be able to confirm the diagnosis and develop an effective treatment plan.",
      sender: "user",
    },
    {
      text: "I agree, doctor. Based on the test results, I believe we can confirm the diagnosis of breast cancer. Let's work together to develop a comprehensive treatment plan for the patient.",
      sender: "not_user",
    },
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

  /**
   * The handleSendMessage function is called when the user clicks the send button or presses enter.
   * It adds a new message to the conversation state and scrolls the chat body to the bottom.
   */
  const handleSendMessage = () => {
    if (inputText.trim() === "") return;
    const newMessage: Message = { text: inputText.trim(), sender: "user" };
    setConversation([...conversation, newMessage]);
    setInputText("");
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
    <div className="flex flex-col bg-color1">
      <div
        ref={chatBodyRef}
        className="flex max-h-[60vh] flex-col overflow-y-scroll p-[15px] text-textColorDark"
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
        <div className="w-[100%] p-1">
          <input
            type="text"
            placeholder="Type a message..."
            className="bg-lowContrastColor @onFocus:border-primaryColor mr-[10px] w-[94%] rounded-[20px] border-[1px] border-[#ccc] p-[10px] text-black text-textColorDark"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleEnter}
          />
          <button
            className="sn-send-button h-10 w-10"
            onClick={handleSendMessage}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisAI;
