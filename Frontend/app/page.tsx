import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Spline from "@splinetool/react-spline/next";
import { FloatingDockDemo } from "@/my_components/floatingDock";
import TryButton from "@/my_components/tryButton";
import QuestionList from "@/my_components/faq";

const faqs = [
  {
    question: "What is ISHA?",
    answer:
      "ISHA is an AI-driven medical platform designed to streamline patient data processing and assist doctors with diagnostics. It leverages advanced machine learning and natural language processing to handle vast patient data, providing intelligent insights and supporting decision-making.",
  },
  {
    question: "How does ISHA help with patient data management?",
    answer:
      "ISHA converts PDFs and medical reports into structured tokens and stores them in a searchable database. This feature allows doctors to access patient information quickly without manually sorting through documents, providing a comprehensive overview tailored to each patient's needs.",
  },
  {
    question: "What is the knowledge base in ISHA?",
    answer:
      "ISHA’s knowledge base is a personalized repository of medical data for each patient. It extracts and structures critical information from reports and notes, making it easy for patients and doctors to retrieve specific details when needed, like trends in blood sugar or previous diagnoses.",
  },
  {
    question: "How does ISHA extract important metrics from patient reports?",
    answer:
      "Using the Text-to-Vitals system, ISHA identifies and highlights essential health metrics, like blood pressure or hemoglobin levels, from patient reports. This information is then displayed in a way that’s easy to understand, allowing both doctors and patients to stay updated on vital health indicators over time.",
  },
  {
    question: "What does ISHA's 'Ask Your Report' feature do?",
    answer:
      "The 'Ask Your Report' feature enables patients and doctors to query specific details within all stored reports without manually reading through them. For instance, a patient can ask about insulin levels on a certain date, and ISHA retrieves relevant information instantly, making it a scalable solution for large data volumes.",
  },
  {
    question: "Can ISHA visualize patient data?",
    answer:
      "Yes, ISHA includes a prompt-to-chart generation tool that creates visual representations of health metrics over time. This allows patients to see trends in their health data, like kidney stone size changes, without having to interpret complex medical terms.",
  },
  {
    question: "What is the AI-powered Health Chart feature?",
    answer:
      "ISHA’s AI-powered Health Chart lets patients have a conversation about their symptoms, with the AI making suggestions based on their medical history. If a patient reports a headache, for example, ISHA might ask follow-up questions and log this interaction, adding new symptoms to the knowledge base for future reference.",
  },
  {
    question: "How does ISHA assist doctors with differential diagnosis?",
    answer:
      "ISHA's Differential Diagnosis Tool supports doctors by suggesting potential diagnoses based on symptoms and history, using medically precise language. This feature provides a second opinion for doctors, helping them assess multiple possibilities and ensure nothing is overlooked in complex cases.",
  },
  {
    question: "Can ISHA retain data from patient interactions with the AI?",
    answer:
      "Yes, ISHA saves every conversation from the Health Chart feature as a report. These interactions are stored in the knowledge base, ensuring that even minor symptoms discussed with the AI are available to doctors later, enriching the patient’s medical history.",
  },
  {
    question: "How does ISHA support doctors in managing multiple patients?",
    answer:
      "ISHA provides doctors with a quick overview of each patient’s health, notes, and reports. Doctors can add their own notes, which ISHA integrates into the knowledge base, keeping each patient’s record up to date and supporting efficient patient management.",
  },
  {
    question: "What makes ISHA different from other diagnostic tools?",
    answer:
      "ISHA combines AI-driven data processing, patient-specific summarization, and a doctor-optimized differential diagnosis tool, offering a comprehensive platform. It’s designed to reduce doctors' workloads, provide patients with understandable health information, and streamline medical data handling for everyone involved.",
  },
  {
    question: "How secure is the data stored in ISHA?",
    answer:
      "ISHA prioritizes data security by implementing encryption and other security measures to ensure patient data remains confidential and compliant with healthcare privacy standards, making it safe for sensitive medical information.",
  },
  {
    question: "Does ISHA offer remote support?",
    answer:
      "Yes, ISHA includes a 24/7 medical support model, giving healthcare providers continuous access to patient data, summaries, and diagnostic support. This ensures timely responses and support, even outside regular office hours.",
  },
  {
    question: "Can ISHA handle high volumes of medical data?",
    answer:
      "Absolutely. ISHA is optimized for processing large volumes of patient reports, clinical notes, and historical data. It uses machine learning and NLP capabilities to manage high data volumes efficiently, making it suitable for healthcare institutions with extensive patient records.",
  },
  {
    question: "How does ISHA bridge the gap between doctors and patients?",
    answer:
      "ISHA provides patients with simplified medical insights and visual data representations, making health information more accessible. For doctors, it offers medically detailed diagnostics and summaries, allowing them to communicate effectively with patients and make informed decisions quickly.",
  },
  {
    question: "Can doctors customize ISHA’s recommendations or insights?",
    answer:
      "Yes, doctors can add notes and observations to ISHA’s knowledge base. These entries are factored into future recommendations, creating a more tailored experience and enabling doctors to track specific details important for ongoing patient care.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-7 px-10">
      {/* Dock */}
      <div className="fixed bottom-0 z-20 w-full">
        <FloatingDockDemo />
      </div>
      {/* Main entry */}
      <div
        id="home"
        className="relative h-[65vh] w-full rounded-lg bg-[#3730e2] p-4 text-white"
      >
        <div className="absolute z-10 ml-10 mt-6 flex flex-col justify-between gap-10 leading-none">
          <div>
            <p className="text-[2rem] font-medium text-black">
              Isha<span className="text-white">.</span>
            </p>
            <p className="max-w-[40vw] text-[5rem] font-semibold">
              Diagnostic Expert System
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="max-w-[30vw] text-sm font-medium">
              We develop technologies and platforms to make diagnosis better and
              faster. Making doctors more efficient and patients more
              comfortable.
            </p>
            <div className="flex gap-2">
              <TryButton
                link="/login"
                type="faded"
                classN="w-[3rem]"
                text="Try"
              />
              <TryButton
                link="https://www.youtube.com/watch?v=3aWsb__FfgY&embeds_referring_euri=http%3A%2F%2Flocalhost%3A3000%2F&source_ve_path=OTY3MTQ"
                type="light"
                classN="text-white"
                text="View Demo"
              />
            </div>
          </div>
        </div>
        <div className="flex h-full items-center justify-end">
          <div className="h-full w-[60%]"></div>
          <Spline scene="https://prod.spline.design/2jJ0pq-7iLSt7LyV/scene.splinecode" />
        </div>
      </div>
      {/* Infinite line */}
      <div className="w-full overflow-hidden rounded-lg bg-[#3730e2]">
        <div className="animate-marquee whitespace-nowrap py-3">
          <span className="mx-4 font-medium text-white">AI Knowledge Base</span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">Doctor Management</span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">Reports Query AI</span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">
            Vitals Chart Generator
          </span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">
            Context Aware Support
          </span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">
            Differential Diagnosis Tool
          </span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">AI Knowledge Base</span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">Doctor Management</span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">Reports Query AI</span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">
            Vitals Chart Generator
          </span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">
            Context Aware Support
          </span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">
            Differential Diagnosis Tool
          </span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">AI Knowledge Base</span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">Doctor Management</span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">Reports Query AI</span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">
            Vitals Chart Generator
          </span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">
            Context Aware Support
          </span>
          <span className="mx-4 font-medium text-white"> * </span>
          <span className="mx-4 font-medium text-white">
            Differential Diagnosis Tool
          </span>
          <span className="mx-4 font-medium text-white"> * </span>
        </div>
      </div>
      {/* Features */}
      <div
        id="expertise"
        className="mt-10 flex w-full flex-col items-center px-20"
      >
        <div className="text-[4rem] font-medium">
          Our Expertise<span className="text-[#3730e2]">.</span>
        </div>
        <div className="grid w-full grid-cols-2 gap-2">
          <div className="relative flex h-[25vh] w-full transform overflow-clip rounded-lg bg-[#0b0b0b] transition duration-300 hover:-translate-x-2 hover:-translate-y-2 hover:scale-100 hover:shadow-lg">
            <div className="w-3/4">
              <img src="/images/DNA.png" alt="logo" className="w-full" />
            </div>
            <div className="absolute right-0 top-0 flex h-full w-[40%] items-center justify-start p-4 text-[1.5rem] font-semibold text-white backdrop-blur-sm">
              Context Aware Analysis
            </div>
          </div>
          <div className="relative flex h-[25vh] w-full transform overflow-clip rounded-lg bg-[#0b0b0b] transition duration-300 hover:-translate-y-2 hover:translate-x-2 hover:scale-100 hover:shadow-lg">
            <div className="w-3/4">
              <img src="/images/Pill.png" alt="logo" className="w-full" />
            </div>
            <div className="absolute right-0 top-0 flex h-full w-[40%] items-center justify-start p-4 text-[1.5rem] font-semibold text-white backdrop-blur-sm">
              Report Management
            </div>
          </div>
          <div className="relative flex h-[25vh] w-full transform overflow-clip rounded-lg bg-[#0b0b0b] transition duration-300 hover:-translate-x-2 hover:translate-y-2 hover:scale-100 hover:shadow-lg">
            <div className="w-full">
              <img src="/images/human.png" alt="logo" className="w-full" />
            </div>
            <div className="absolute right-0 top-0 flex h-full w-[40%] items-center justify-start p-4 text-[1.5rem] font-semibold text-white backdrop-blur-sm">
              Differential Diagnosis
            </div>
          </div>
          <div className="relative flex h-[25vh] w-full transform overflow-clip rounded-lg bg-[#0b0b0b] transition duration-300 hover:translate-x-2 hover:translate-y-2 hover:scale-100 hover:shadow-lg">
            <div className="w-full">
              <img src="/images/AI.png" alt="logo" className="w-full" />
            </div>
            <div className="absolute right-0 top-0 flex h-full w-[40%] items-center justify-start p-4 text-[1.5rem] font-semibold text-white backdrop-blur-sm">
              AI Knowledge Base
            </div>
          </div>
        </div>
      </div>
      {/* About Us */}
      <div
        id="aboutUs"
        className="mt-10 flex w-full flex-col items-center px-20"
      >
        <div className="text-[4rem] font-medium">
          About Us<span className="text-[#3730e2]">.</span>
        </div>
        <iframe
          src="https://www.youtube.com/embed/3aWsb__FfgY?si=-w0znHBQR13w1RNq"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="h-[70vh] w-3/4"
        ></iframe>
      </div>
      {/* FAQs */}
      <div id="faqs" className="mt-10 flex w-full flex-col items-center px-20">
        <div className="text-[4rem] font-medium">
          FAQs<span className="text-[#3730e2]">.</span>
        </div>
        <QuestionList questions={faqs} />
      </div>
      {/* Contact Us */}
      <div
        id="contactUs"
        className="mb-10 mt-10 flex w-full flex-col items-center"
      >
        {/* Footer */}
        <div className="w-full rounded-lg bg-[#3730e2] p-4 text-gray-300">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            {/* Logo or Branding */}
            <div className="text-2xl font-semibold text-black">
              Isha<span className="text-white">.</span>
            </div>

            {/* Navigation Links */}
            <div className="mt-4 flex space-x-6 text-sm md:mt-0">
              <a href="#" className="hover:text-white">
                About Us
              </a>
              <a href="#" className="hover:text-white">
                Services
              </a>
              <a href="#" className="hover:text-white">
                Careers
              </a>
              <a href="#" className="hover:text-white">
                Blog
              </a>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 h-[1px] w-full bg-gray-700" />

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-between text-sm md:flex-row">
            {/* Copyright */}
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} YourBrand. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://github.com/avneets2103"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/avneets2103"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href="mailto:avneets2103@gmail.com"
                className="hover:text-white"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
