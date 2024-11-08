import React, {useState } from "react";
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
import { DocSchema } from "@/Interfaces";
import { getDocList } from "@/Helpers/apiCalls";
import Image from "next/image";

interface Props{
  searchDoc: string,
  setSearchDoc: React.Dispatch<React.SetStateAction<string>>,
  setDocList: React.Dispatch<React.SetStateAction<DocSchema[]>>,
}

/**
 * @description Component for top of the doctor view page
 * @prop {string} searchDoc - the current search query
 * @prop {React.Dispatch<React.SetStateAction<string>>} setSearchDoc - the function to update the search query
 * @returns {JSX.Element} The top of the doctor view page containing the search bar and a button to add a new doctor
 */
function MyDocTop (props: Props) {
  const { searchDoc, setSearchDoc, setDocList } = props;
  const [doctorCode, setDoctorCode] = useState(""); // the doctor one time add token
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // state for the modal
  const [loading, setLoading] = useState(false); // state for the loading animation

  /**
   * Function to handle the add doctor button click
   * It sends a request to the backend to add a doctor
   * @param {string} doctorCode - the doctor one time add token
   */
  const handleAddDoctor = async (doctorCode: string) => {
    try {
      setLoading(true);
      const addDoctorRes = await axios.post(
        BACKEND_URI + "/patient/addDoctor",
        {
          "doctorGeneratedOneTimeToken": doctorCode
        },
      );
      getDocList(setDocList);
      ToastInfo("Doctor added succussfully");
    } catch (e) {
      ToastErrors("Add Doctor Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="width-[100%] my-4 flex h-[7%] cursor-pointer items-center justify-between font-medium">
      <div className="flex gap-4">
        <SectionDisplay />
      </div>
      <div className="flex h-[7vh] items-end gap-2">
        <Input
          isClearable // allow clearing the search query
          radius="sm" // rounded corners
          placeholder="Search Doctors" // placeholder text
          startContent={ // icon on the left of the input
            <div>
              <Image width={100} height={100} src="/icons/search.png" className="w-[15px]" alt="logo" />
            </div>
          }
          value={searchDoc} // the current search query
          onChange={(e) => setSearchDoc(e.target.value)} // update the search query
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
                  {"Add Doctor using Code"}
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
                        radius="sm" // rounded corners
                        placeholder="Enter Unique Code" // placeholder text
                        startContent={ // icon on the left of the input
                          <div>
                            <Image width={100} height={100}
                              src="/icons/web.png"
                              className="w-[15px]"
                              alt="logo"
                            />
                          </div>
                        }
                        value={doctorCode} // the current value of the input
                        onChange={(e) => setDoctorCode(e.target.value)} // update the input value
                      />
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="mx-auto bg-primaryColor text-white"
                    variant="flat"
                    onPress={() => {
                      handleAddDoctor(doctorCode);
                    }}
                  >
                    Add Doctor
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

export default MyDocTop;
