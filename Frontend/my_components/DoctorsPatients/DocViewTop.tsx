import React, { useState } from "react";
import SectionDisplay from "../sectionDisplay/sectionDisplay";
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
import Image from "next/image";

interface Props{
  searchPat: string,
  setSearchPat: React.Dispatch<React.SetStateAction<string>>,
}

/**
 * @description Component for top of the doctor view page
 * @prop {string} searchPat - the current search query
 * @prop {React.Dispatch<React.SetStateAction<string>>} setSearchPat - the function to update the search query
 * @returns {JSX.Element} The top of the doctor view page containing the search bar and a button to add a new patient
 */
function DocViewTop(props: Props) {
  const { searchPat, setSearchPat } = props;
  const [patientMail, setPatientMail] = useState(""); // the email address of the patient to add
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // state for the modal
  const [loading, setLoading] = useState(false); // state for the loading animation

  return (
    <div className="width-[100%] my-4 flex h-[7%] cursor-pointer items-center justify-between font-medium">
      <div className="flex gap-4">
        <SectionDisplay />
      </div>
      <div className="flex h-[7vh] items-end gap-2">
        <Input
          isClearable // allow clearing the search query
          radius="sm" // rounded corners
          placeholder="Search Patient" // placeholder text
          startContent={ // icon on the left of the input
            <div>
              <Image width={100} height={100} src="/icons/search.png" className="w-[15px]" alt="logo" />
            </div>
          }
          value={searchPat} // the current search query
          onChange={(e) => setSearchPat(e.target.value)} // update the search query
          onClear={() => setSearchPat("")} // clear the search query
        />
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondaryColor"
            onClick={ () => {
              onOpen();
            }}
          >
            <Image width={100} height={100} src="/icons/additionH.png" className="w-[15px]" alt="logo" />
          </div>
        </div>
        <Modal
          isOpen={isOpen} // whether the modal is open or not
          onOpenChange={onOpenChange} // function to update the state of the modal
          placement="top-center" // where to place the modal
        >
          <ModalContent>
            {(onClose) => (
              <>  
                <ModalHeader className="flex flex-col items-center justify-center gap-1 font-medium">
                  {"New Patient Code"}
                </ModalHeader>
                <ModalBody>
                  {(loading && (
                    <div className="flex h-full w-full items-center justify-center">
                      <CircularProgress aria-label="Loading..." color="danger" />
                    </div>
                  )) || (
                    <>
                    <Input
                      variant="faded"
                      radius="sm"
                      placeholder="Enter patient's mail id"
                      startContent={
                        <div>
                          <Image width={100} height={100}
                            src="/icons/mail.png"
                            className="w-[15px]"
                            alt="logo"
                          />
                        </div>
                      }
                      value={patientMail}
                      onChange={(e) => setPatientMail(e.target.value)}
                    />
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="mx-auto bg-purple-300"
                    variant="flat"
                    onPress={async () => {
                      try {
                        setLoading(true);
                        const tokenResponse = await axios.post(
                          `${BACKEND_URI}/doctor/generatePatientCode`,
                          {
                            "patientMail": patientMail
                          }
                        )
                        setPatientMail("");
                        ToastInfo("Patient Code sent on Mail");
                        onClose();
                      } catch (e) {
                        ToastErrors("Add Patient Failed");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Send Code
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

export default DocViewTop;
