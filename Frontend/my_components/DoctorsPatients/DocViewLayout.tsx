"use client"
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const DocViewLayout = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl gap-4 md:auto-rows-[18rem] md:grid-cols-6",
        className,
      )}
      // style={{ gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))" }}
    >
      {children}
    </div>
  );
};

export default dynamic (() => Promise.resolve(DocViewLayout), {ssr: false})