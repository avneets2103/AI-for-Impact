"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import Image from "next/image";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#home",
    },

    {
      title: "Expertise",
      icon: (
        <Image
          src="/icons/expert.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
          className="p-[2px]"
        />
      ),
      href: "#expertise",
    },
    {
      title: "About Us and FAQs",
      icon: (
        <Image
          src="/icons/qn.png"
          width={20}
          height={20}
          alt="AboutUs"
          className="p-[4px]"
        />
      ),
      href: "#aboutUs",
    },
    {
      title: "Contact Us",
      icon: (
        <Image
          src="/icons/contact.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
          className="p-[2px]"
        />
      ),
      href: "#contactUs",
    },
    {
      title: "Signup/Login",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/login",
    },
  ];
  return (
    <div className="flex items-center justify-center w-full">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div>
  );
}
