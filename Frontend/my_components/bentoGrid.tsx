import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import Image from "next/image";

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

interface Props{
  imgLink: string;
}
const Skeleton = ({imgLink}: Props) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 items-center justify-center">
    <Image width={100} height={100} src={imgLink} alt="logo" className="h-full rounded-lg"/>
  </div>
);
const items = [
  {
    title: "Patient Knowledge Base",
    description: "An AI powered central location for all your patient related information, facts and records.",
    header: <Skeleton imgLink="/images/KB.png" />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Smart Report Query",
    description: "A powerful tool to query and analyze anything and everything from patient records.",
    header: <Skeleton imgLink="/icons/logo.png"/>,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "One Stop Vitals Chart",
    description: "A simple and easy to use vitals chart for quick and accurate monitoring based on patient's reports.",
    header: <Skeleton imgLink="/icons/logo.png"/>,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Context Aware Support",
    description: "A powerful tool combining LLMs and the power of knowledge bases to provide contextualized support to both patients and doctors.",
    header: <Skeleton imgLink="/icons/logo.png"/>,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Management system",
    description: "Easily manage patients and doctors.",
    header: <Skeleton imgLink="/icons/logo.png"/>,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
];
