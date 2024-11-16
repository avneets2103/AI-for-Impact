import {
  Button,
  ButtonGroup,
  CircularProgress,
  Input,
  Textarea,
} from "@nextui-org/react";
import { icons } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { ReportsData } from "@/Data/ReportsData";
import MyPatientReportHero from "./myPatientsReports";
import DiagnosisAI from "./diagnosisAI";
import { getPatientMedical, removePatient } from "@/Helpers/apiCalls";
import { GraphSchema, PatientDataSchema, PatientSchema } from "@/Interfaces";
import Image from "next/image";
import { VitalsLayout, VitalsLayoutItem } from "../healthVitals/VitalsLayout";
import {
  DoctorVitalsLayout,
  DoctorVitalsLayoutItem,
} from "./DoctorVitalsLayout";
import { ToastErrors, ToastInfo } from "@/Helpers/toastError";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Loader from "@/components/ui/Loader";
import axios from "@/utils/axios";

import { BACKEND_URI } from "@/CONSTANTS";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

interface Props {
  name: string;
  img: string | any;
  id: string;
  setPatList: React.Dispatch<React.SetStateAction<Array<PatientSchema>>>;
  onClose: Function;
  absoluteSummary: string;
}

const MedicalReport = ({
  name,
  img,
  id,
  setPatList,
  onClose,
  absoluteSummary,
}: Props) => {
  const [patientId, setPatientId] = useState<string>(id);
  const [patientData, setPatientData] = useState<PatientDataSchema>({
    sex: "",
    age: "",
    bloodGroup: "",
    condition: "",
    currentSymptoms: "",
    medicalHistory: "",
    reportsList: [],
    absoluteSummary: "",
    note: "",
    chartsList: [],
  });

  useEffect(() => {
    getPatientMedical(id, setPatientData, setDoctorNotes);
  }, []);
  const [prompt, setPrompt] = useState("");
  const { theme, setTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Summarization");
  const [doctorNotes, setDoctorNotes] = useState(patientData.note);
  const [doctorNotesEnabeled, setDoctorNotesEnabeled] = useState(false);
  const [toggleLabel, setToggleLabel] = useState("Edit"); // New state for button label
  const placeholders = [
    "Prompt what you want to make?",
    "Patient's Insulin dosage since the past 5 years?",
    "Patient's protein levels in the past 3 months?",
    "Patient's Blood pressure in the past 10 reports?",
  ];
  const [chartGenerated, setChartGenerated] = useState(false);
  const [newChart, setNewChart] = useState<GraphSchema>({
    id: "",
    name: "",
    data: [],
    description: "",
    sourceList: [],
    unit: "",
    queryText: "",
  });

  // Toggle button label and functionality
  const handleToggle = async () => {
    if (doctorNotesEnabeled) {
      // save doctor Note to backedn
      await axios.post(`${BACKEND_URI}/doctor/saveDoctorNote`, {
        patientId: id,
        note: doctorNotes,
      });
      ToastInfo("Doctor Note saved successfully");
    }
    setDoctorNotesEnabeled(!doctorNotesEnabeled); // Toggle the enabled state
    setToggleLabel(doctorNotesEnabeled ? "Edit" : "Save"); // Update label
  };

  const patientTabs = [
    {
      name: "Reports",
      iconL: "/icons/reportL.png",
      iconD: "/icons/reportD.png",
    },
    {
      name: "Summarization",
      iconL: "/icons/summaryL.png",
      iconD: "/icons/summaryD.png",
    },
    {
      name: "Graphical Reports",
      iconL: "/icons/graphL.png",
      iconD: "/icons/graphD.png",
    },
    {
      name: "Diagnosis",
      iconL: "/icons/diagnosisL.png",
      iconD: "/icons/diagnosisD.png",
    },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "Reports":
        return <MyPatientReportHero data={patientData.reportsList} />;
      case "Summarization":
        return (
          <div className="flex h-full w-full flex-col gap-4">
            <div>
              <h2 className="flex gap-2 text-[20px] font-bold text-textColorDark">
                <img
                  src="/icons/aiGenerated.png"
                  alt=""
                  className="h-[20px] w-[20px]"
                />
                Patient Overview
              </h2>
              <p>{patientData.absoluteSummary}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-textColorDark">
                  Doctor's Notes
                </h2>
                <Button
                  color={doctorNotesEnabeled ? "primary" : "secondary"}
                  onClick={handleToggle}
                >
                  {toggleLabel}
                </Button>
              </div>
              <Textarea
                disabled={!doctorNotesEnabeled}
                variant="underlined"
                color="primary"
                placeholder="Type your notes here..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                minRows={6} // Set minimum rows for height
                maxRows={10} // Limit max rows for more controlled scrolling
                className="w-full" // Full width for better UI
              />
            </div>
          </div>
        );
      case "Graphical Reports":
        return (
          <div className="flex flex-col gap-4">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={(e) => setPrompt(e.target.value)}
              onSubmit={async () => {
                try {
                  setLoading(true);
                  let response = await axios.post(
                    `${BACKEND_URI}/patient/queryDateVal`,
                    {
                      queryText: prompt,
                      patientId: id,
                    },
                  );
                  let nD = [];
                  const dat = response.data.data.list;
                  for (let i = 0; i < dat.length; i++) {
                    const val = dat[i].value;
                    let st = "";
                    for (let j = 0; j < val.length; j++) {
                      if (val[j] === " ") {
                        break;
                      }
                      st += val[j];
                    }
                    nD.push({
                      date: dat[i].date,
                      value: Number(st),
                    });
                  }
                  setNewChart({
                    name: response.data.data.title,
                    id: response.data.data.id,
                    description: response.data.data.description,
                    data: nD,
                    sourceList: response.data.data.sourceList,
                    unit: response.data.data.unit,
                    queryText: prompt,
                  });
                  setChartGenerated(true);
                  response = await axios.post(
                    `${BACKEND_URI}/patient/acceptChart`,
                    {
                      patientId: id,
                      chartName: newChart.name,
                      data: newChart.data,
                      queryText: newChart.queryText,
                      description: newChart.description,
                      sourceList: newChart.sourceList,
                      unit: newChart.unit,
                    },
                  );
                  getPatientMedical(id, setPatientData, setDoctorNotes);
                  setPrompt("");
                  ToastInfo("Chart Added Successfully");
                } catch (e) {
                  ToastErrors("Add Report Failed");
                } finally {
                  setLoading(false);
                }
              }}
            />
            {loading ? (
              <div className="flex h-[50vh] w-full items-center justify-center">
                <CircularProgress aria-label="Loading..." color="danger" />
              </div>
            ) : (
              <DoctorVitalsLayout className="max-h-[65vh] w-full overflow-y-scroll">
                {patientData.chartsList.map(
                  ({
                    id,
                    name,
                    data,
                    description,
                    unit,
                    sourceList,
                    queryText,
                  }) => (
                    <DoctorVitalsLayoutItem
                      key={id}
                      id={id}
                      name={name}
                      data={data}
                      description={description}
                      unit={unit}
                      sourceList={sourceList}
                      queryText={queryText}
                      setPatientData={setPatientData}
                      patientId={patientId}
                      setDoctorNotes={setDoctorNotes}
                    />
                  ),
                )}
              </DoctorVitalsLayout>
            )}
          </div>
        );
      case "Diagnosis":
        return <DiagnosisAI id={id} />;
      default:
        return null;
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [queryResponseText, setQueryResponseText] = useState("");
  const [queryResponseShow, setQueryResponseShow] = useState(false);
  const [LoadingText, setLoadingText] = useState(true);
  const [oldPrompt, setOldPrompt] = useState(""); // Loader state
  const [context, setContext] = useState("");

  const cleanTextForDisplay = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove **bold** markers
      .replace(/[^\w\s\d\.\,\!\?\-]/g, "") // Remove special characters (excluding common punctuation)
      .replace(/\n+/g, " ") // Replace multiple newlines with a single space
      .replace(/(\d+\.\s)/g, "\n$1") // Insert newline before numbered points
      .trim(); // Trim any excess whitespace at the start/end
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(queryResponseText);
      ToastInfo("Text copied");
    } catch (err) {
      console.error("Failed to copy the text to clipboard", err);
    }
  };

  return (
    <div className="bg-backgroundColor flex h-full w-full rounded-[20px] text-textColorDark">
      <div className="flex w-[15%] flex-col items-center justify-between border-r-2 border-bgColor p-2">
        <div>
          <div className="flex h-12 w-40 items-center justify-center rounded-lg border-2 border-bgColor pl-2 text-medium font-medium">
            {selectedTab}
          </div>
          <div className="flex justify-center">
            <Image
              width={100}
              height={100}
              src={img}
              alt="Patient"
              className="mt-2 w-[90%] rounded-[20px] shadow-ourBoxShadow"
            />
          </div>
          <div className="mt-[10px] flex w-[90%] flex-col items-start pl-2 text-[14px]">
            <p className="text-large font-semibold">{name}</p>
            <p>
              <span className="font-medium">Sex</span>: {patientData.sex}
            </p>
            <p>
              <span className="font-medium">Age</span>: {patientData.age}
            </p>
            <p>
              <span className="font-medium">Condition</span>:{" "}
              {patientData.condition}
            </p>
            <p>
              <span className="font-medium">Blood Group</span>:{" "}
              {patientData.bloodGroup}
            </p>
          </div>
        </div>
        <div className="mb-2 flex w-full justify-start">
          <Button
            className="w-full"
            onPress={() => {
              removePatient(id, setPatList);
              onClose();
            }}
          >
            Remove Patient
          </Button>
        </div>
      </div>
      <div className="flex max-h-[85vh] w-[85%] flex-col overflow-y-auto">
        <div className="flex w-full flex-col items-center">
          <div className="flex">
            <div className="flex w-[200px] justify-center gap-2 rounded-[20px] bg-bgColor p-2">
              {patientTabs.map((tab) => (
                <Button
                  key={tab.name}
                  isIconOnly
                  className={`${selectedTab === tab.name ? "bg-white dark:bg-primaryColor" : ""}`}
                  onClick={() => setSelectedTab(tab.name)}
                >
                  {theme === "dark" ? (
                    <Image
                      width={100}
                      height={100}
                      src={tab.iconD}
                      alt="icon"
                      className="w-[20px]"
                    />
                  ) : (
                    <Image
                      width={100}
                      height={100}
                      src={tab.iconL}
                      alt="icon"
                      className="w-[20px]"
                    />
                  )}
                </Button>
              ))}
            </div>
            <div>
              <Button onPress={onOpen} className="mx-2 my-2" isIconOnly>
                <Image
                  width={100}
                  height={100}
                  src="/icons/aiGenerated.png"
                  className="w-[20px]"
                  alt="logo"
                />
              </Button>
              <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                  onOpenChange();
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
                        <p className="flex items-center gap-1 text-lg font-semibold">
                          <img
                            src="/icons/aiGenerated.png"
                            alt=""
                            className="h-[20px] w-[20px]"
                          />
                          Ask your Reports
                        </p>
                      </ModalHeader>
                      <ModalBody className="max-h-[60vh] overflow-y-auto">
                        <div className="flex flex-col">
                          <div className="pb-4">
                            <PlaceholdersAndVanishInput
                              placeholders={placeholders}
                              onChange={(e) => setPrompt(e.target.value)}
                              onSubmit={async () => {
                                setQueryResponseShow(false);
                                setLoadingText(false);
                                let resp = await axios.post(
                                  `${BACKEND_URI}/patient/queryReports`,
                                  {
                                    queryText: prompt,
                                    patientId: id,
                                  },
                                );
                                setQueryResponseShow(true);
                                setOldPrompt(prompt);
                                setQueryResponseText(cleanTextForDisplay(resp.data.data.response));
                                setLoadingText(true);
                              }}
                            />
                          </div>
                          {!queryResponseShow && !LoadingText && (
                            <div className="flex h-full items-center justify-center">
                              <Loader />
                            </div>
                          )}
                          {queryResponseShow && (
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
                                <Button
                                  isIconOnly
                                  className="left-0 top-0"
                                  onClick={copyToClipboard}
                                >
                                  <img
                                    src="/icons/copy.png"
                                    alt=""
                                    className="h-[15px] w-[15px]"
                                  />
                                </Button>
                              </div>

                              {
                                <div>
                                  <p className="text-md font-medium">
                                    {oldPrompt}
                                  </p>
                                  <TextGenerateEffect
                                    words={queryResponseText}
                                  />
                                </div>
                              }
                            </div>
                          )}
                        </div>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
        <div className="h-[full] w-full overflow-y-scroll p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MedicalReport;
