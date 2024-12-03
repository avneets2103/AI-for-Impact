import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BACKEND_URI, minPassLength, sidebarMenu } from "@/CONSTANTS";
import { sidebarMenuItems } from "@/Interfaces";
import { setCurrentPage } from "@/RTK/features/sidebar";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import { Button, Input } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { logout } from "@/Helpers/logout";
import axios from "@/utils/axios";
import { getUserDetails, updatePassword } from "@/Helpers/apiCalls";
import { ToastErrors, ToastInfo } from "@/Helpers/toastError";
import Image from "next/image";
import { FileUploadLimited } from "@/components/ui/file-upload-limited";
import imageCompression from "browser-image-compression";

const Sidebar: React.FC = () => {
  const Router = useRouter();
  const dispatcher = useDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [putURL, setPutURL] = useState<string>("");

  const handleFileUpload = async (files: File[]) => {
    try {
      const res = await axios.post(
        `${BACKEND_URI}/auth/profilePhotoUploadSignedURL`,
        {
          imageType: files[0].type,
        },
      );
      setPutURL(res.data.data);
      setFiles(files);
    } catch (error) {
      ToastErrors("Re-upload file");
      throw error;
    }
    console.log(files);
  };

  const handleImageSubmit = async () => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(files[0], options);
      const formData = new FormData();
      formData.append("file", compressedFile);

      // Use fetch instead of Axios for uploading to the signed URL
      const response = await fetch(putURL, {
        method: "PUT",
        body: files[0], // directly pass the file, not formData
        headers: {
          "Content-Type": files[0].type, // Ensure the file content type is correct
        },
      });

      if (!response.ok) {
        throw new Error("Image upload failed!");
      }
      Cookies.set("newUser", "false");
      Router.push("/sections/myDoctors");
      ToastInfo("Image uploaded successfully");
    } catch (error) {
      ToastErrors("Image upload failed! Try again");
      throw error;
    }
  };

  // Add this state to ensure component is only rendered on client-side
  const [isMounted, setIsMounted] = useState(false);
  const [isDoctor, setIsDoctor] = useState<boolean | null>(null); // Initially null to avoid hydration mismatch

  useEffect(() => {
    setIsMounted(true); // Component is mounted
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Only run on client side

    // Check the doctor cookie on client-side once mounted
    setIsDoctor(Cookies.get("isDoctor") === "true" || false);
    const checkTokens = async () => {
      try {
        // Verify access token
        const accessTokenResponse = await axios.post(
          `${BACKEND_URI}/auth/verifyAccessToken`,
        );
        if (accessTokenResponse.status !== 200) {
          Router.push("/login");
          logout();
          return;
        }
      } catch (error) {
        Router.push("/login");
        logout();
        console.log("Access token invalid, trying refresh token...");
      }
    };
    getUserDetails(
      setName,
      setEmail,
      setIsDoc,
      setDoctorDetails,
      setPatientDetails,
      setImageLink,
    );
    checkTokens();
  }, [isMounted, Router]);

  const currentPage = useSelector((state: any) => state.sidebar.currentPage);
  const { theme, setTheme } = useTheme();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isDoc, setIsDoc] = useState<boolean>(false);
  const [imageLink, setImageLink] = useState<string>("");
  const [doctorDetails, setDoctorDetails] = useState<{
    qualifications: string;
    experience: string;
    speciality: string;
    hospitalNumber: string;
  }>({
    qualifications: "",
    experience: "",
    speciality: "",
    hospitalNumber: "",
  });
  const [patientDetails, setPatientDetails] = useState<{
    bloodGroup: string;
    sex: string;
    age: string;
  }>({
    bloodGroup: "",
    sex: "",
    age: "",
  });

  const [updatedPassword, setUpdatedPassword] = useState<string>("");
  const handleUpdatePassword = () => {
    if (updatePassword.length < minPassLength) {
      ToastErrors(`Password must be at least ${minPassLength} characters long`);
      return;
    }
    updatePassword(updatedPassword);
    setUpdatedPassword("");
    ToastInfo("Password updated successfully");
  };

  // Render null or loader before the component mounts to avoid hydration issues
  if (!isMounted || isDoctor === null) {
    return null; // Or return a loader if needed
  }

  return (
    <div className="flex h-screen w-[6rem] min-w-[6rem] items-center justify-center">
      <div className="flex h-full w-[3rem] flex-col justify-between gap-[2rem] py-[1rem]">
        <div className="flex flex-col items-center justify-center gap-[0.7rem]">
          <div>
            <Image
              width={120}
              height={120}
              src="/icons/logo.png"
              alt="logo"
              className="w-full"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-[0.8rem] rounded-[25px] bg-color1 py-[1rem]">
            <Image
              width={100}
              height={100}
              src={
                theme === "dark"
                  ? "/icons/darkMode.png"
                  : "/icons/lightMode.png"
              }
              alt="Theme"
              className="w-[40%]"
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
              }}
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center rounded-[25px] bg-color1 py-[0.2rem]">
            {sidebarMenu.map((item: sidebarMenuItems, index: number) => {
              if (item.patient == !isDoctor) {
                if (item.path === currentPage) {
                  return (
                    <div
                      key={item.path + "S" || index} // Ensure key is unique
                      className="flex h-[2.8rem] w-[2.8rem] flex-col items-center justify-center rounded-[50%] border-[1px] border-textColorDark bg-secondaryColor"
                    >
                      <Image
                        width={100}
                        height={100}
                        src={item.iconS}
                        alt={item.name}
                        className="w-[40%]"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={item.path || index} // Ensure key is unique
                      className="flex h-[2.8rem] w-[2.8rem] flex-col items-center justify-center rounded-[50%] bg-color1"
                      onClick={() => {
                        dispatcher(setCurrentPage({ currentPage: item.path }));
                        Router.push(`/sections/${item.path}`);
                      }}
                    >
                      <Image
                        width={100}
                        height={100}
                        src={theme === "dark" ? item.iconNSD : item.iconNS}
                        alt={item.name}
                        className="w-[40%]"
                      />
                    </div>
                  );
                }
              }
              return <></>;
            })}
          </div>
        </div>
        <div
          className="flex w-full flex-col items-center justify-center rounded-3xl bg-color1 py-1 drop-shadow-md"
          onClick={onOpen}
        >
          {/* Settings Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-color1">
            <Image
              width={44}
              height={44}
              src={"/icons/setting.NS.png"}
              alt="settings"
              className="w-2/5"
            />
          </div>

          {/* Avatar */}
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-color1">
            <Image
              width={44}
              height={44}
              src={imageLink}
              alt="avatar"
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Settings
              </ModalHeader>
              <ModalBody className="max-h-[52vh] overflow-y-scroll">
                <Input
                  type="text"
                  placeholder="Name"
                  label="Name"
                  value={name || ""}
                  disabled
                />
                <Input
                  type="text"
                  placeholder="Email"
                  label="Email"
                  value={email || ""}
                  disabled
                />
                {isDoc && (
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Speciality"
                    label="Speciality"
                    value={doctorDetails.speciality || ""}
                    disabled
                  />
                )}
                {isDoc && (
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Qualification"
                    label="Qualification"
                    value={doctorDetails.qualifications || ""}
                    disabled
                  />
                )}
                {isDoc && (
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Experience"
                    label="Experience"
                    value={doctorDetails.experience || ""}
                    disabled
                  />
                )}
                {isDoc && (
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Hospital Number"
                    label="Hospital Number"
                    value={doctorDetails.hospitalNumber || ""}
                    disabled
                  />
                )}
                {!isDoc && (
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Age"
                    label="Age"
                    value={patientDetails.age || ""}
                    disabled
                  />
                )}
                {!isDoc && (
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Sex"
                    label="Sex"
                    value={patientDetails.sex || ""}
                    disabled
                  />
                )}
                {!isDoc && (
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Blood Group"
                    label="Blood Group"
                    value={patientDetails.bloodGroup || ""}
                    disabled
                  />
                )}
                <div className="flex gap-2">
                  <Input
                    size="sm"
                    type="password"
                    placeholder="New password "
                    label="Update Password"
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                  />
                  <Button
                    className="h-[6] bg-primaryColor text-white"
                    variant="flat"
                    onPress={() => {
                      handleUpdatePassword();
                      updatePassword.length >= minPassLength && onClose();
                    }}
                  >
                    Update
                  </Button>
                </div>
                <div className="mx-auto flex w-full max-w-4xl flex-col rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                  <div>
                    <FileUploadLimited
                      onChange={handleFileUpload}
                      maxFileCount={1}
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    size="md"
                    className="w-[30%]"
                    onPress={handleImageSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-purple-200 text-black"
                  variant="flat"
                  onPress={async () => {
                    logout();
                    onClose();
                    Router.push("/login");
                  }}
                >
                  Logout
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Sidebar;
