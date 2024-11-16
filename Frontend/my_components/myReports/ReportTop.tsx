"use client";
import React, { useState, useRef } from "react";
import SectionDisplay from "../sectionDisplay/sectionDisplay";
import Loader from "@/components/ui/Loader";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import axios from "@/utils/axios";
import { BACKEND_URI } from "@/CONSTANTS";
import { ToastErrors, ToastInfo } from "@/Helpers/toastError";
import { CircularProgress } from "@nextui-org/react";
import { FileUploadLimited } from "@/components/ui/file-upload-limited";
import { getReportsList } from "@/Helpers/apiCalls";
import { ReportsSchema } from "@/Interfaces";
import Image from "next/image";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

interface Props {
  reportSearch: string;
  setReportSearch: React.Dispatch<React.SetStateAction<string>>;
  setReportsList: React.Dispatch<React.SetStateAction<ReportsSchema[]>>;
}

function ReportTop(props: Props) {
  const { reportSearch, setReportSearch, setReportsList } = props;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [reportPDFLink, setReportPDFLink] = useState("");
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");
  const [where, setWhere] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [putURL, setPutURL] = useState<string>("");
  const [addReport, setAddReport] = useState(false);
  const [queryResponseText, setQueryResponseText] = useState("");
  const [queryResponseShow, setQueryResponseShow] = useState(false);
  const [LoadingText, setLoadingText] = useState(true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(queryResponseText);
      ToastInfo("Text Copied");
    } catch (err) {
      console.error("Failed to copy the text to clipboard", err);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      console.log(files[0].name.split(".")[0]);
      const res = await axios.post(
        `${BACKEND_URI}/patient/reportAddSignedURL`,
        {
          reportName: files[0].name.split(".")[0],
        },
      );
      setPutURL(res.data.data.url);
      setReportPDFLink(res.data.data.reportPDFLink);
      setFiles(files);
    } catch (error) {
      ToastErrors("Re-upload file");
      throw error;
    }
  };

  const placeholders = [
    "Ask anything in your reports!",
    "My Insulin dosage since the past 5 years?",
    "My neuro surgery lead to?",
  ];

  const [prompt, setPrompt] = useState("");
  const [oldPrompt, setOldPrompt] = useState("");

  const handleSubmit = async (onClose: () => void) => {
    setLoading(true);
    if (!what || !where || !when) {
      ToastErrors("Please fill all fields");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      if (files[0].type !== "application/pdf") {
        ToastErrors("Please upload a pdf file only!");
        return;
      }
      // Use fetch instead of Axios for uploading to the signed URL
      const response = await fetch(putURL, {
        method: "PUT",
        body: files[0], // directly pass the file, not formData
        headers: {
          "Content-Type": files[0].type, // Ensure the file content type is correct
        },
      });

      if (!response.ok) {
        throw new Error("Report upload failed!");
      }

      const res = await axios.post(`${BACKEND_URI}/patient/addReport`, {
        reportName: what,
        location: where,
        reportDate: when,
        reportPDFLink: reportPDFLink,
      });

      getReportsList(setReportsList);
      setWhat("");
      setWhere("");
      setWhen("");
      setFiles([]);
      setPutURL("");
      onClose();
      ToastInfo("Report uploaded successfully");
    } catch (error) {
      ToastErrors("Report upload failed! Try again");
      throw error;
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

  return (
    <div className="width-[100%] my-4 flex h-[7%] cursor-pointer items-center justify-between font-medium">
      <div className="flex gap-4">
        <SectionDisplay />
      </div>
      <div className="flex h-[7vh] items-end gap-2">
        <Input
          radius="sm"
          placeholder="Search Reports"
          startContent={
            <div>
              <Image
                width={100}
                height={100}
                src="/icons/search.png"
                className="w-[15px]"
                alt="logo"
              />
            </div>
          }
          value={reportSearch}
          onChange={(e) => setReportSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondaryColor"
            onClick={() => {
              setAddReport(false);
              onOpen();
            }}
          >
            <Image
              width={100}
              height={100}
              src="/icons/aiGenerated.png"
              className="w-[20px]"
              alt="logo"
            />
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondaryColor"
            onClick={() => {
              setAddReport(true);
              onOpen();
            }}
          >
            <Image
              width={100}
              height={100}
              src="/icons/additionH.png"
              className="w-[15px]"
              alt="logo"
            />
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          onOpenChange={() => {
            onOpenChange();
            setWhat("");
            setWhen("");
            setWhere("");
            setFiles([]);
            setPutURL("");
            setQueryResponseText("");
            setQueryResponseShow(false);
            setPrompt("");
          }}
          placement="top-center"
          size="xl"
          className="p-4"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col items-center justify-center gap-1 font-medium">
                  {addReport ? (
                    "Add Report"
                  ) : (
                    <p className="flex items-center gap-1 text-lg font-semibold">
                      <img
                        src="/icons/aiGenerated.png"
                        alt=""
                        className="h-[20px] w-[20px]"
                      />
                      Ask your Reports
                    </p>
                  )}
                </ModalHeader>
                <ModalBody className="max-h-[60vh] overflow-y-scroll">
                  {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <CircularProgress
                        aria-label="Loading..."
                        color="danger"
                      />
                    </div>
                  ) : (
                    <>
                      {addReport ? (
                        <div className="flex flex-col gap-5">
                          <FileUploadLimited
                            onChange={handleFileUpload}
                            maxFileCount={1}
                          />
                          <div className="flex flex-col gap-2">
                            <p className="px-2 text-sm text-textColorLight">
                              Enter Report Details:{" "}
                            </p>
                            <div className="flex flex-row items-center gap-2">
                              <p className="flex h-10 items-center rounded-xl border-1 px-2 text-center text-sm text-textColorLight">
                                What?{" "}
                              </p>
                              <Input
                                variant="underlined"
                                radius="sm"
                                placeholder="Eg: Blood test report"
                                value={what}
                                onChange={(e) => setWhat(e.target.value)}
                              />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                              <p className="flex h-10 items-center rounded-xl border-1 px-2 text-center text-sm text-textColorLight">
                                When?{" "}
                              </p>
                              <Input
                                variant="underlined"
                                radius="sm"
                                placeholder="Eg: 20/10/2014"
                                value={when}
                                onChange={(e) => setWhen(e.target.value)}
                              />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                              <p className="flex h-10 items-center rounded-xl border-1 px-2 text-center text-sm text-textColorLight">
                                Where?{" "}
                              </p>
                              <Input
                                variant="underlined"
                                radius="sm"
                                placeholder="XYZ Hospital"
                                value={where}
                                onChange={(e) => setWhere(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="pb-4">
                            <PlaceholdersAndVanishInput
                              placeholders={placeholders}
                              onChange={(e) => setPrompt(e.target.value)}
                              onSubmit={async () => {
                                setQueryResponseShow(false);
                                setLoadingText(false);
                                const response = await axios.post(
                                  `${BACKEND_URI}/patient/queryReports`,
                                  {
                                    queryText: prompt,
                                  },
                                );
                                setOldPrompt(prompt);

                                setQueryResponseText(
                                  response.data.data.response
                                );

                                setQueryResponseShow(true);
                                setLoadingText(true);
                              }}
                            />
                          </div>
                          {!queryResponseShow && !LoadingText && (
                            <div className="flex h-full items-center justify-center">
                              <Loader />
                            </div>
                          )}
                          {queryResponseShow ? (
                            <div className="relative flex max-h-[40vh] items-start gap-2 overflow-y-auto">
                              <div className="flex flex-col items-start gap-1">
                                <Button
                                  color="primary"
                                  isIconOnly
                                  className="left-0 top-0"
                                >
                                  <img
                                    src="/icons/aiGenerated.png"
                                    alt=""
                                    className="h-[20px] w-[20px]"
                                  />
                                </Button>
                                <Button isIconOnly className="left-0 top-0" onClick={copyToClipboard}>
                                  <img
                                    src="/icons/copy.png"
                                    alt=""
                                    className="h-[15px] w-[15px]"
                                  />
                                </Button>
                              </div>
                              <div>
                                <p className="text-md font-medium">
                                  {oldPrompt}
                                </p>
                                <TextGenerateEffect
                                  words={cleanTextForDisplay(queryResponseText)}
                                />
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </ModalBody>
                {addReport ? (
                  <ModalFooter>
                    <>
                      <Button
                        className="mx-auto bg-primaryColor text-white"
                        variant="flat"
                        onPress={async () => {
                          try {
                            setLoading(true);
                            handleSubmit(onClose);
                          } catch (e) {
                            ToastErrors("Add Report Failed");
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        Add Report
                      </Button>
                    </>
                  </ModalFooter>
                ) : (
                  <></>
                )}
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default ReportTop;
