import React, {useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import SectionDisplay from "../sectionDisplay/sectionDisplay";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "@/utils/axios";
import { BACKEND_URI } from "@/CONSTANTS";
import { ToastErrors, ToastInfo } from "@/Helpers/toastError";
import { CircularProgress } from "@nextui-org/react";
import Image from "next/image";

interface Props{
  searchVitals: string,
  setSearchVitals: React.Dispatch<React.SetStateAction<string>>
}

function VitalsTop(props: Props) {
  const {searchVitals, setSearchVitals} = props;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const placeholders = [
    "Prompt what you want to make?",
    "My Insulin dosage since the past 5 years?",
    "My protein levels in the past 3 months?",
    "Blood pressure in the past 10 reports?",
  ];

  return (
    <div className="width-[100%] my-4 flex h-[7%] cursor-pointer items-center justify-between font-medium">
      <div className="flex gap-4">
        <SectionDisplay />
      </div>
      <div className="flex h-[7vh] items-end gap-2">
        <Input
          radius="sm"
          placeholder="Search Graph"
          startContent={
            <div>
              <Image width={100} height={100} src="/icons/search.png" className="w-[15px]" alt="logo" />
            </div>
          }
          value={searchVitals}
          onChange={(e) => setSearchVitals(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondaryColor"
            onClick={() => {
              onOpen();
            }}
          >
            <Image width={100} height={100} src="/icons/additionH.png" className="w-[15px]" alt="logo" />
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
          size="2xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col items-center justify-center gap-1 font-medium">
                  {"Make a New Report based Visualization"}
                </ModalHeader>
                <ModalBody>
                  {(loading && (
                    <div className="flex h-full w-full items-center justify-center">
                      <CircularProgress aria-label="Loading..." color="danger" />
                    </div>
                  )) || (
                  <div className="flex flex-col gap-5">
                    <PlaceholdersAndVanishInput
                      placeholders={placeholders}
                      onChange={(e)=>setPrompt(e.target.value)}
                      onSubmit={()=> console.log(prompt)}
                    />
                  </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="mx-auto bg-primaryColor text-white"
                    variant="flat"
                    onPress={async () => {
                      try {
                        setLoading(true);
                        // TODO: API call to generate graph and all
                      } catch (e) {
                        ToastErrors("Add Report Failed");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Generate ✨
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default VitalsTop;
