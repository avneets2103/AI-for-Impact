"use client"
import { useState } from "react";

interface QuestionProps {
  question: string;
  answer: string;
}

const QuestionList: React.FC<{ questions: QuestionProps[] }> = ({ questions }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-[60%] min-w-[20rem] mx-auto">
      {questions.map((item, index) => (
        <div key={index} className="border-b border-gray-300">
          {/* Question Button */}
          <button
            onClick={() => toggleQuestion(index)}
            className="w-full text-left py-4 px-6 font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-black focus:outline-none transition duration-300"
          >
            {item.question}
          </button>

          {/* Answer Section */}
          <div
            className={`${
              openIndex === index ? "max-h-[300px] py-4" : "max-h-0"
            } overflow-hidden transition-all duration-300 ease-in-out px-6`}
          >
            <p className="text-gray-600">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
