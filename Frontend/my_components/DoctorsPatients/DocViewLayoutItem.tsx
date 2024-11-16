"use client";
import { cn } from "@/lib/utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import MedicalReport from "./MedicalReport";
import dynamic from "next/dynamic";
import { getPatList } from "@/Helpers/apiCalls";
import { PatientSchema } from "@/Interfaces";
import Image from "next/image";

const DocViewLayoutItem = ({
  id,
  name,
  sex,
  age,
  img,
  bloodGroup,
  setPatList,
  absoluteSummary
}: {
  id: string;
  name: string;
  sex: string;
  age: string;
  img: string;
  bloodGroup: string;
  setPatList: React.Dispatch<React.SetStateAction<Array<PatientSchema>>>,
  absoluteSummary: string
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex cursor-pointer flex-col justify-between space-y-4 overflow-clip rounded-xl bg-white p-0 shadow-input",
      )}
      onClick={
        ()=>{
          getPatList(setPatList);
          onOpen();
        }
      }
    >
      <div className="relative h-full w-full">
        <Image width={100} height={100} src={img} alt="doctor" className="-z-5 absolute h-full w-full" />
        <div className="-z-5 absolute flex h-full w-full bg-black opacity-30"></div>
        <div className="absolute z-0 flex h-full w-full flex-col justify-between p-3 text-[whitesmoke]">
          <p>{name.slice(0, Math.min(name.length, 25))}</p>
          <div>
            <p>{sex.slice(0, Math.min(sex.length, 25))}</p>
            <p>{age}</p>
          </div>
        </div>
      </div>
     
      <Modal
        isOpen={isOpen}
        size="full"
        onOpenChange={onOpenChange}
        className="h-[95vh] w-[95vw]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="">
                <MedicalReport name={name} img={img} id={id} setPatList={setPatList} absoluteSummary={absoluteSummary} onClose={onClose}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default dynamic (() => Promise.resolve(DocViewLayoutItem), {ssr: false})