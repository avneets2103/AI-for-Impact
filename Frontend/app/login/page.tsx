"use client";
import React, { useState } from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import imageCompression from 'browser-image-compression';
import "./page.css";
import LoginCard from "@/my_components/loginCard/loginCard";
import DemoCard from "@/my_components/loginCard/demoCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BACKEND_URI } from "@/CONSTANTS";
import Cookies from "js-cookie";
import { tokenCookies } from "@/Helpers/cookieHandling";
import axios from "@/utils/axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button, image } from "@nextui-org/react";
import { ToastErrors, ToastInfo } from "@/Helpers/toastError";
import { FileUploadLimited } from "@/components/ui/file-upload-limited";
import Image from "next/image";

function Page() {
  const Router = useRouter();
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    // Check if access token or refresh token exist
    const checkTokens = async () => {
      // Check for access token
      try {
        const accessTokenResponse = await axios.post(
          `${BACKEND_URI}/auth/verifyAccessToken`,
        );
        if (accessTokenResponse.status === 200) {
          // Access token exist, i.e. user is already logged in
          if (accessTokenResponse.data.data.isDoctor) {
            // if he is a doctor then his page will be the My Patients' page
            Router.push("/sections/myPatients");
          } else {
            // if he is a patient then his page will be the My Doctor' page
            Router.push("/sections/myDoctors");
          }
          return;
        }
      } catch (error) {
        console.log("Access token invalid, trying refresh token...");
      }

      // If access token has expired there is still a check for refresh token
      try {
        const refreshTokenResponse = await axios.post(
          `${BACKEND_URI}/auth/refreshAccessToken`,
          {
            refreshToken: Cookies.get("refreshToken") || "",
          },
        );
        if (refreshTokenResponse.status === 200) {
          // if refresh token was there, then we will recieve new access token and refresh token, so we save it on cookies
          tokenCookies(
            refreshTokenResponse.data.data.accessToken,
            refreshTokenResponse.data.data.refreshToken,
          );
          // based on doctor or patient status we send them to their required page
          if (refreshTokenResponse.data.data.isDoctor) {
            Router.push("/sections/myPatients");
          } else {
            Router.push("/sections/myDoctors");
          }
          return;
        }
      } catch (error) {
        console.log("Refresh token invalid.");
      }
    };
    if(Cookies.get("newUser") === "true"){
      return;
    }
    checkTokens();
  }, [Router]);
  const [newPatientSignup, setNewPatientSignup] = React.useState(false);
  const [imageUpload, setImageUpload] = React.useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [putURL, setPutURL] = useState<string>("");

  const handleFileUpload = async (files: File[]) => {
    try {
      const res = await axios.post(
        `${BACKEND_URI}/auth/profilePhotoUploadSignedURL`,
        {
          imageType: files[0].type
        }
      )
      setPutURL(res.data.data);
      setFiles(files);
    } catch (error) {
      ToastErrors("Re-upload file");
      throw error;
    }
  };

  // form data
  const [name, setName] = useState("");
  const [sex, setSex] = useState("M");
  const [age, setAge] = useState(18);
  const [bloodGroup, setBloodGroup] = useState("B+");

  const handleDetailsSubmit = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URI}/auth/savePatientDetails`, 
        {
          name: name,
          sex: sex,
          age: age,
          bloodGroup: bloodGroup
        }
      );
      setImageUpload(true);
      ToastInfo("Details saved successfully");
    } catch (error) {
      ToastErrors("Details werent saved! Try again")
      throw error;
    } 
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
  

  return (
    <>
      {/* TOAST NOTIFICATION COMPONENT */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* MAIN CONTENT */}
      <div>
        {/* BACKGROUND GRADIENT ANIMATION */}
        <div className="absolute left-0 top-0 z-0 h-screen w-full">
          {theme === "dark" ? (
            <BackgroundGradientAnimation
              gradientBackgroundStart="rgb(26, 255, 213)"
              gradientBackgroundEnd="rgb(11, 47, 159)"
              firstColor="65, 179, 162"
              secondColor="11, 47, 159"
              thirdColor="118, 149, 255"
              fourthColor="65, 179, 162"
              fifthColor="11, 47, 159"
              pointerColor="118, 149, 255"
            />
          ) : (
            <BackgroundGradientAnimation
              gradientBackgroundStart="rgb(26, 255, 213)"
              gradientBackgroundEnd="rgb(125, 131, 255)"
              firstColor="26, 255, 213" // green
              secondColor="125, 131, 255" // purple
              thirdColor="255,255,255" // white
              fourthColor="26, 255, 213"
              fifthColor="125, 131, 255"
              pointerColor="255,255,255"
            />
          )}
        </div>
        {/* Stuff of top */}
        <div className="z-1 absolute left-0 top-0 flex h-screen w-full items-center justify-center">
          <div className="loginGlass relative z-0 flex h-5/6 w-10/12 items-center justify-between rounded-[20px] bg-color2 px-[5rem] shadow-ourBoxShadow">
            {newPatientSignup ?
            <>
              {!imageUpload?
              <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                  Enter a few details for the best daignosis!
                </p>
          
                <form className="my-8">
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="What do we call you?" type="email" 
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    />
                  </LabelInputContainer>
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" placeholder="Your age here" type="number" 
                      onChange={(e) => setAge(Number(e.target.value))}
                      value={age}/>
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="sex">Sex</Label>
                      <div className="flex flex-row gap-2 items-center h-full border-1 border-gray-200 rounded-lg p-2">
                        <div className="flex flex-row gap-1">
                        <input type="radio" id="male" name="sex" value="M" onChange={(e) => setSex(e.target.value)}/>
                        <Label htmlFor="male">M</Label>
                        </div >
                        <div className="flex flex-row gap-1">
                        <input type="radio" id="female" name="sex" value="F" onChange={(e) => setSex(e.target.value)}/>
                        <Label htmlFor="female">F</Label>
                        </div>
                        <div className="flex flex-row gap-1">
                        <input type="radio" id="others" name="sex" value="Others" onChange={(e) => setSex(e.target.value)}/>
                        <Label htmlFor="others">Others</Label>
                        </div>
                      </div>
                    </LabelInputContainer>
                  </div>
                  <LabelInputContainer className="mb-8">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <div className="flex flex-row gap-2 items-center h-full border-1 border-gray-200 rounded-lg p-2">
                      <div className="flex flex-row gap-1">
                      <input type="radio" id="B+" name="bg" value="B+" onChange={(e) => setBloodGroup(e.target.value)}/>
                      <Label htmlFor="male">B+</Label>
                      </div >
                      <div className="flex flex-row gap-1">
                      <input type="radio" id="B-" name="bg" value="B-" onChange={(e) => setBloodGroup(e.target.value)}/>
                      <Label htmlFor="female">B-</Label>
                      </div>
                      <div className="flex flex-row gap-1">
                      <input type="radio" id="O+" name="bg" value="O+" onChange={(e) => setBloodGroup(e.target.value)}/>
                      <Label htmlFor="others">O+</Label>
                      </div>
                      <div className="flex flex-row gap-1">
                      <input type="radio" id="O-" name="bg" value="O-" onChange={(e) => setBloodGroup(e.target.value)}/>
                      <Label htmlFor="male">O-</Label>
                      </div >
                      <div className="flex flex-row gap-1">
                      <input type="radio" id="A+" name="bg" value="A+" onChange={(e) => setBloodGroup(e.target.value)}/>
                      <Label htmlFor="female">A+</Label>
                      </div>
                      <div className="flex flex-row gap-1">
                      <input type="radio" id="A-" name="bg" value="A-" onChange={(e) => setBloodGroup(e.target.value)}/>
                      <Label htmlFor="others">A-</Label>
                      </div>
                      <div className="flex flex-row gap-1">
                      <input type="radio" id="AB+" name="bg" value="AB+" onChange={(e) => setBloodGroup(e.target.value)}/>
                      <Label htmlFor="female">A+</Label>
                      </div>
                      <div className="flex flex-row gap-1">
                      <input type="radio" id="AB-" name="bg" value="AB-" onChange={(e) => setBloodGroup(e.target.value)}/>
                      <Label htmlFor="others">AB-</Label>
                      </div>
                    </div>
                  </LabelInputContainer>
                  <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                  <div className="flex flex-col space-y-4">
                    <Button 
                      className="bg-primaryColor text-white"
                      variant="flat"
                      onPress={handleDetailsSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
              :
              <>
                <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col">
                  <div>
                    <FileUploadLimited onChange={handleFileUpload} maxFileCount={1}/>
                  </div>
                  <div className="flex justify-center">
                    <Button size="md" className="w-[30%]" onPress={handleImageSubmit}>Submit</Button>
                  </div>
                </div>
              </>
              }
            </> 
            :
            <>
              {/* The left dynamic part of the login page */}
              <LoginCard setNewPatientSignup = {setNewPatientSignup}/>
              {/* The fixed text on the login page*/}
              <DemoCard />
              {/* The right most image */}
              <Image
                src="./icons/HeartImg.svg"
                width={100}
                height={100}
                alt="heartImage"
                className="hide-on-small m-[-1rem] w-[25%] min-w-40"
              />{" "}
            </>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
