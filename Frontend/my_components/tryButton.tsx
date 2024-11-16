"use client";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  link: string;
  classN?: string;
  type: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined;
  text: string;
}

function TryButton({link, classN, type, text}: Props) {
  return (
    <Button
      variant={type}
      className={classN}
      onClick={() => {
        window.open(link, "_blank");
      }}
    >
      {text} <Image src="/icons/linkArrow.png" alt="arrow" width={10} height={10} />
    </Button>
  );
}

export default TryButton;
