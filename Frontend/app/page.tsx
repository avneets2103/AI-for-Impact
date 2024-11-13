import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Spline from "@splinetool/react-spline/next";
import { Button } from "@nextui-org/react";
import { FloatingDockDemo } from "@/my_components/floatingDock";
import TryButton from "@/my_components/tryButton";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-7 px-10">
      {/* Dock */}
      <div className="fixed bottom-0 z-20 w-full">
        <FloatingDockDemo />
      </div>
      {/* Main entry */}
      <div id="home" className="relative h-[65vh] w-full rounded-lg bg-[#3730e2] p-4 text-white">
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
              <TryButton link="/login" type="faded" classN="w-[3rem] text-[#3730e2]" text="Try" />
              <TryButton link="https://www.youtube.com/watch?v=3aWsb__FfgY&embeds_referring_euri=http%3A%2F%2Flocalhost%3A3000%2F&source_ve_path=OTY3MTQ" type="light" classN="text-white" text="View Demo" />
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
      <div  id="expertise" className="mt-10 flex w-full flex-col items-center px-20">
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
      <div id="aboutUs" className="mt-10 flex w-full flex-col items-center px-20">
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
      <div id="contactUs" className="mt-10 flex w-full flex-col items-center mb-10">
        {/* Footer */}
        <div className="w-full bg-[#3730e2] text-gray-300 p-4 rounded-lg">
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
