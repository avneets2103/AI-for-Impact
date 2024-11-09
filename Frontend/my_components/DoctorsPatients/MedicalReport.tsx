import { Button, ButtonGroup, Input, Textarea } from "@nextui-org/react";
import { icons } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { ReportsData } from "@/Data/ReportsData";
import MyPatientReportHero from "./myPatientsReports";
import DiagnosisAI from "./diagnosisAI";
import { getPatientMedical, removePatient } from "@/Helpers/apiCalls";
import { PatientDataSchema, PatientSchema } from "@/Interfaces";
import Image from "next/image";
import { VitalsLayout, VitalsLayoutItem } from "../healthVitals/VitalsLayout";
import { HealthGraphs } from "@/Data/HealthGraphs";
import { DoctorVitalsLayout, DoctorVitalsLayoutItem } from "./DoctorVitalsLayout";
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

const MedicalReport = ({ name, img, id, setPatList, onClose, absoluteSummary }: Props) => {
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
  });

  useEffect(() => {
    getPatientMedical(id, setPatientData, setDoctorNotes);
  }, []);
  const [prompt, setPrompt] = useState("");
  const { theme, setTheme } = useTheme();

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
    }
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "Reports":
        return <MyPatientReportHero data={patientData.reportsList}/>;
      case "Summarization":
        return (
          <div className="h-full w-full flex flex-col gap-4">
            <div>
              <h2 className="text-[20px] font-bold text-textColorDark flex gap-2">
                <img src="/icons/aiGenerated.png" alt="" className="w-[20px] h-[20px]"/>
                Patient Overview
              </h2>
              <p>{patientData.absoluteSummary}</p>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-[20px] font-bold text-textColorDark">Doctor's Notes</h2>
                <Button color={doctorNotesEnabeled?"primary":"secondary"} onClick={handleToggle}>{toggleLabel}</Button>
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
              onSubmit={() => console.log(prompt)}
            />
            <DoctorVitalsLayout className="w-full max-h-[65vh] overflow-y-scroll">
              {HealthGraphs.map(({ id, name, data, description }) => (
                <DoctorVitalsLayoutItem
                  key={id}
                  id={id}
                  name={name}
                  data={data}
                  description={description}
                />
              ))}
            </DoctorVitalsLayout>
          </div>
        );
      case "Diagnosis":
        return <DiagnosisAI/>;
      default:
        return null;
    }
  };
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [queryResponseText, setQueryResponseText] = useState("");
  const [queryResponseShow, setQueryResponseShow] = useState(false);
  const [LoadingText,setLoadingText]=useState(true);
  // const [prompt, setPrompt] = useState("");
  const [oldPrompt, setOldPrompt] = useState(""); // Loader state
  const [context, setContext] = useState("");

  

  const cleanTextForDisplay = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold** markers
      .replace(/[^\w\s\d\.\,\!\?\-]/g, '') // Remove special characters (excluding common punctuation)
      .replace(/\n+/g, ' ')             // Replace multiple newlines with a single space
      .replace(/(\d+\.\s)/g, '\n$1')    // Insert newline before numbered points
      .trim();                          // Trim any excess whitespace at the start/end
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(queryResponseText);
      ToastInfo("Report Link Copied");
    } catch (err) {
      console.error("Failed to copy the text to clipboard", err);
    }
  };
  

  return (
    <div className="rounded-[20px] bg-backgroundColor flex text-textColorDark w-full h-full">
      <div className="w-[15%] items-center flex flex-col p-2 border-r-2 border-bgColor justify-between">
        <div>
          <div className="pl-2 font-medium text-medium border-2 border-bgColor flex items-center justify-center rounded-lg h-10">
            {selectedTab}
          </div>
          <div className="flex justify-center">
            <Image
              width={100}
              height={100}
              src={img}
              alt="Patient"
              className="w-[90%] rounded-[20px] shadow-ourBoxShadow mt-2"
            />
          </div>
          <div className="mt-[10px] items-start text-[14px] flex w-[90%] flex-col pl-2">
            <p className="font-semibold text-large">{name}</p>
            <p><span className="font-medium">Sex</span>: {patientData.sex}</p>
            <p><span className="font-medium">Age</span>: {patientData.age}</p>
            <p><span className="font-medium">Condition</span>: {patientData.condition}</p>
            <p><span className="font-medium">Blood Group</span>: {patientData.bloodGroup}</p>
          </div>
        </div>
        <div className="w-full flex justify-start">
          <Button className="w-full" onPress={() => { removePatient(id, setPatList); onClose(); }}>
            Remove Patient
          </Button>
        </div>
      </div>
      <div className="w-[85%] flex flex-col">
        <div className="w-full flex flex-col items-center">
          <div className="flex">
          <div className="flex gap-2 bg-bgColor w-[200px] justify-center p-2 rounded-[20px]">
            {patientTabs.map((tab) => (
              <Button
                key={tab.name}
                isIconOnly
                className={`${selectedTab === tab.name ? "bg-primaryColor" : ""}`}
                onClick={() => setSelectedTab(tab.name)}
              >
                {theme === "dark" ? 
                  <Image width={100} height={100} src={tab.iconD} alt="icon" className="w-[20px]" /> :
                  <Image width={100} height={100} src={tab.iconL} alt="icon" className="w-[20px]" />
                }
              </Button>
            ))}
            
           
          </div>
          <div>
          <Button onPress={onOpen} className="my-2 mx-2">
        
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
  onOpenChange={onOpenChange}
 
  placement="top-center"
  size="xl"
  className="p-4"
>
  <ModalContent>
    {(onClose)=>
      <>
    <ModalHeader>
      <p className="text-lg font-semibold flex gap-1 items-center">
        <img src="/icons/aiGenerated.png" alt="" className="w-[20px] h-[20px]" />
        Ask your Reports
      </p>
    </ModalHeader>
    <ModalBody className="max-h-[60vh] overflow-y-scroll">
      <div className="flex flex-col">
        <div className="pb-4">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setPrompt(e.target.value)}
            onSubmit={async () => {
              setQueryResponseShow(false);
              setLoadingText(false);
              const response = await axios.post(`${BACKEND_URI}/patient/queryReports`, {
                queryText: prompt,
                patientId: id,
              });
              
              setOldPrompt(prompt);
              setQueryResponseText(response.data.data.response !== "" ? response.data.data.response : "Oops !!! Answer could not be found.");
              setQueryResponseShow(true);
              setLoadingText(true);
            }}
          />
        </div>
        {!queryResponseShow && !LoadingText && (
  <div className="flex justify-center items-center h-full">
    <Loader />
  </div>
)}
        {queryResponseShow && (
          <div className="flex gap-2 items-start max-h-[40vh] overflow-y-auto relative">
            <div className="flex flex-col gap-1 items-start">
              <Button color="primary" isIconOnly className="top-0 left-0">
                <img src="/icons/aiGenerated.png" alt="" className="w-[20px] h-[20px]" />
              </Button>
              <Button
                isIconOnly
                className="top-0 left-0"
                onClick={copyToClipboard}
              >
                <img src="/icons/copy.png" alt="" className="w-[15px] h-[15px]" />
              </Button>
            </div>
            
            {
             <div>
              {/*<p className="text-md font-medium">{oldPrompt}</p>*/}
              <TextGenerateEffect words={cleanTextForDisplay(queryResponseText)} />
            </div>
            }
           
          </div>
        )}
      </div>
    </ModalBody>
   
    </>
}
   
  </ModalContent>
</Modal>

     
      </div>

          </div>
          

        </div>
        <div className="w-full p-4 h-full max-h-[80vh] overflow-y-scroll">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MedicalReport;
