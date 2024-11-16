"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { WobbleCard } from "@/components/ui/wobble-card";
import { ToastInfo } from "@/Helpers/toastError";

export const ReportLayout = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid gap-3 md:auto-rows-[14rem] md:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const ReportLayoutItem = ({
  id,
  reportName,
  reportDate,
  location,
  reportPDFLink,
  reportSummary,
}: {
  id: string;
  reportName: string;
  reportDate: string;
  location: string;
  reportPDFLink: string;
  reportSummary: string;
}) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reportPDFLink);
      ToastInfo("Report Link Copied");
    } catch (err) {
      console.error("Failed to copy the text to clipboard", err);
    }
  };
  const cleanTextForDisplay = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove **bold** markers
      .replace(/[^\w\s\d\.\,\!\?\-]/g, "") // Remove special characters (excluding common punctuation)
      .replace(/\n+/g, " ") // Replace multiple newlines with a single space
      .replace(/(\d+\.\s)/g, "\n$1") // Insert newline before numbered points
      .trim(); // Trim any excess whitespace at the start/end
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div
      key={id}
      className={cn(
        "group/bento row-span-1 flex w-[21vw] cursor-pointer flex-col justify-between space-y-4 overflow-clip rounded-xl border border-transparent bg-[--fixed-bg-color] p-0",
      )}
    >
      <div className="relative h-full w-full" onClick={onOpen}>
        <Image
          width={100}
          height={100}
          src={"/images/rep1.png"}
          alt="report"
          className="-z-5 absolute h-full w-full"
        />
        <div className="-z-5 absolute flex h-full w-full bg-black opacity-20"></div>
        <div className="absolute z-0 flex h-full w-full flex-col justify-between p-3 text-[whitesmoke]">
          <p className="text-lg font-medium">
            {reportName.slice(0, Math.min(reportName.length, 25))}
          </p>
          <div>
            <p>{reportDate.slice(0, Math.min(reportDate.length, 25))}</p>
            <p>{location.slice(0, Math.min(location.length, 25))}</p>
          </div>
        </div>
      </div>
      <Modal
        size="4xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center" // where to place the modal
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex flex-col gap-2 p-4">
                  <p className="flex gap-1 text-lg font-semibold">
                    <img
                      src="/icons/aiGenerated.png"
                      alt=""
                      className="h-[20px] w-[20px]"
                    />
                    Report Summary
                  </p>
                  <p>{cleanTextForDisplay(reportSummary)}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex w-full justify-end gap-2">
                  <Button onClick={copyToClipboard}>
                    <img
                      src="/images/copyLink.png"
                      alt="copyLink"
                      className="mr-1 h-4 w-4"
                    />
                    Copy Link
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => window.open(reportPDFLink, "_blank")}
                  >
                    {/* <span className="text-3xl">↗️</span> */}
                    <Image src="/icons/linkArrow.png" alt="openReport" width={15} height={15} />
                    Open Report
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
