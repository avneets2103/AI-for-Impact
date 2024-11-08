import { getDocList, removeDoctor } from "@/Helpers/apiCalls";
import { ToastInfo } from "@/Helpers/toastError";
import { DocSchema } from "@/Interfaces";
import { cn } from "@/lib/utils";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";

export const DocLayout = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid md:auto-rows-[18rem] md:grid-cols-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const DocLayoutItem = ({
  id,
  name,
  speciality,
  img,
  qualification,
  experience,
  hospitalNumber,
  setDocList
}: {
  id: string;
  name: string;
  speciality: string;
  img: string;
  qualification: string;
  experience: string;
  hospitalNumber: string;
  setDocList: React.Dispatch<React.SetStateAction<DocSchema[]>>
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hospitalNumber);
      ToastInfo("Appointment Desk Number Copied");
    } catch (err) {
      console.error("Failed to copy the text to clipboard", err);
    }
  };
  return (
    <div
      className={cn(
        "br-black group/bento row-span-1 flex w-[13.4vw] cursor-pointer flex-col justify-between space-y-4 overflow-hidden rounded-xl bg-white p-0 shadow-input transition duration-200 hover:shadow-xl  dark:bg-black dark:shadow-none",
      )}
      onClick={() => {
        getDocList(setDocList);
        onOpen();
      }
      }
    >
      <div className="w-full h-full relative">
        <Image width={100} height={100} src={img} alt="doctor" className="h-full w-full -z-5 absolute"/>
        <div className="h-full w-full bg-black opacity-30 -z-5 absolute flex"></div>
        <div className="h-full w-full z-0 absolute flex justify-between flex-col p-3 text-[whitesmoke]">
          <p>{name.slice(0, Math.min(name.length, 25))}</p>
          <div>
            <p>{speciality.slice(0, Math.min(speciality.length, 25))}</p>
            <p>{qualification.slice(0, Math.min(speciality.length, 25))}</p>
            <p>{experience.slice(0, Math.min(speciality.length, 25))} of Experience</p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center" // where to place the modal
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex items-center gap-2">
                  <Image width={100} height={100}
                    src={img}
                    alt="doctor's image"
                    className="h-[40px] w-[40px] rounded-[35px]"
                  />
                  <p>{name}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-2">
                  <Button
                    className="mx-auto text-primaryColor"
                    variant="flat"
                    onPress={()=>removeDoctor(id, setDocList)}
                  >
                    Remove Doctor
                  </Button>
                  <Button
                    className="mx-auto bg-primaryColor text-white"
                    variant="flat"
                    // call using hospitalNumber
                    onPress={() => {
                      copyToClipboard();
                      window.location.href = `tel:${hospitalNumber}`;
                    }}
                  >
                    Book Appointment
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