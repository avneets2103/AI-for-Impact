"use client";
import React, { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import {
  BACKEND_URI,
  minPassLength,
  otpGap,
  otpLength,
  refreshTokenExpiration,
} from "@/CONSTANTS";
import OtpInput from "react-otp-input";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  handleLogin,
  passIsValid,
  validateEmail,
  handleReset,
  handleForgotPass,
  handleGenerateNewPassword,
} from "@/Helpers/login";
import { useRouter } from "next/navigation";
import { ToastErrors, ToastInfo } from "@/Helpers/toastError";
import axios from "axios";
import { tokenCookies } from "@/Helpers/cookieHandling";
import Image from "next/image";

interface Props {
  setNewPatientSignup: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginCard({ setNewPatientSignup }: Props) {
  const Router = useRouter();
  // required variables and states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passValid, setPassValid] = useState(true);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [otpPage, setOtpPage] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const [OTP, setOTP] = useState("");
  const [time, setTime] = useState(otpGap);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const formattedTime = `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;
  const [sendingOtp, setSendingOtp] = useState(false);

  // useEffects
  const isInvalid: boolean = React.useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);
  useEffect(() => {
    setPassValid(passIsValid(password));
  }, [email, password]);
  useEffect(() => {
    if (OTP.length == otpLength) {
      handleVerify(OTP);
    }
  }, [OTP]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  // event handling functions
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };
  const handlePasswordKeyPress = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        setSendingOtp(true);
        await handleLogin(isInvalid, password, email, setOtpPage);
        Cookies.set("email", email, {
          expires: 1,
        });
        setTime(otpGap);
        setOTP("");
      } catch (error) {
        console.log("Error in sending OTP:", error);
      } finally {
        setSendingOtp(false);
      }
    }
  };
  const forgetEmailKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleForgotPass(setForgotPass, setOtpPage, setPassword);
    }
  };
  const handleVerify = async (OTP: string) => {
    if (OTP.length != otpLength) {
      ToastErrors("OTP too small");
      return;
    } else {
      const verifyBody = {
        email: Cookies.get("email") || "",
        enteredOTP: OTP,
      };
      try {
        const res = await axios.post(
          `${BACKEND_URI}/auth/verifyOTP`,
          verifyBody,
        );
        tokenCookies(res.data.data.accessToken, res.data.data.refreshToken);
        Cookies.set("isDoctor", res.data.data.user.isDoctor, {
          expires: refreshTokenExpiration,
        });
        ToastInfo("OTP verified");
        if (Cookies.get("newUser") === "true") {
          setNewPatientSignup(true);
        } else {
          Router.push("/sections/myCart");
        }
      } catch (error) {
        ToastErrors("Invalid OTP");
      }
    }
  };

  // returning component based on OTP status
  if (!otpPage && !forgotPass) {
    return (
      <>
        <div className="georama-r flex h-[80%] w-full min-w-60 flex-col items-center justify-evenly rounded-[20px] bg-bgColor p-[0.75rem] px-4 shadow-ourBoxShadow md:w-[30%]">
          <Image
            width={100}
            height={100}
            src="/icons/logo.png"
            alt="logo"
            className="w-[50px]"
          />
          <div className="flex flex-col items-center justify-center">
            <p className="georama-b text-2xl">Hey</p>
            <p className="georama-l text-xl">Pls Sign Up or Login</p>
          </div>
          <div className="flex w-full flex-col gap-[8px]">
            <div className="w-full">
              <Input
                className="w-full"
                value={email}
                isInvalid={isInvalid}
                color={isInvalid ? "danger" : "default"}
                errorMessage="Please enter a valid Email"
                onValueChange={setEmail}
                isClearable
                isRequired
                size="sm"
                radius="lg"
                type="email"
                variant="bordered"
                label="Email"
                labelPlacement="inside"
                onKeyPress={handleKeyPress}
              />
              <Input
                isInvalid={!passValid}
                color={!passValid ? "danger" : "default"}
                errorMessage={`Password must be at least ${minPassLength} characters long`}
                ref={passwordInputRef}
                value={password}
                onValueChange={setPassword}
                isRequired
                size="sm"
                radius="lg"
                variant="bordered"
                label="Password"
                type={isVisible ? "text" : "password"}
                labelPlacement="inside"
                onKeyPress={handlePasswordKeyPress}
              />
              <Button
                variant="flat"
                className={
                  sendingOtp
                    ? "w-full bg-white text-primaryColor"
                    : "w-full bg-primaryColor text-bgColor"
                }
                onClick={async () => {
                  try {
                    setSendingOtp(true);
                    await handleLogin(isInvalid, password, email, setOtpPage);
                    Cookies.set("email", email, {
                      expires: 1,
                    });
                    setTime(otpGap);
                    setOTP("");
                  } catch (error) {
                    console.log("Error in sending OTP:", error);
                  } finally {
                    setSendingOtp(false);
                  }
                }}
              >
                {sendingOtp ? (
                  <>
                    <img
                      src="/icons/otp2.gif"
                      alt="loading"
                      className="h-full"
                    />
                    Sending OTP
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>

            <div className="flex w-[100%] justify-end gap-[1rem]">
              <Link
                href="/login"
                onClick={() => {
                  handleForgotPass(setForgotPass, setOtpPage, setPassword);
                }}
                className={
                  "text-[13px] text-slate-600 decoration-solid hover:text-[#885bff]"
                }
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          {/* <p className="text-center text-xs text-textColorLight">
            By clicking continue, you agree to our
            <a href="" className="text-textColorDark">
              {" "}
              Terms of Service{" "}
            </a>
            and
            <a href="" className="text-textColorDark">
              {" "}
              Privacy Policy
            </a>
          </p> */}
          <p className="text-center text-xs text-textColorLight flex flex-col">
            <b>Patient's Credentials:</b> "avneets2103@gmail.com" && "testPass" 
          </p>
          <p className="text-center text-xs text-textColorLight flex flex-col">
            <b>Doctor's Credentials:</b> "avneet.bedi.ug21@nsut.ac.in" && "testPass" 
          </p>
        </div>
      </>
    );
  }
  if (forgotPass) {
    return (
      <div className="georama-r relative flex h-1/2 w-[30%] min-w-60 flex-col items-center justify-evenly rounded-[20px] bg-bgColor p-[0.75rem] shadow-ourBoxShadow">
        <Link href="/login">
          <Image
            width={100}
            height={100}
            src="/icons/back.png"
            alt="back"
            className="absolute left-[1rem] top-[1rem] w-[30px]"
            onClick={() => {
              setForgotPass(false);
            }}
          />
        </Link>

        <Image
          width={100}
          height={100}
          src="/icons/logo.png"
          alt="logo"
          className="w-[50px]"
        />
        <div className="flex flex-col items-center justify-center">
          <p className="georama-b text-xl">Hey</p>
          <p className="georama-l text-xs">Pls enter your registered email</p>
        </div>
        <div className="w-full">
          <div className="otpArea flex flex-col items-center justify-center">
            <Input
              className="w-full"
              value={email}
              isInvalid={isInvalid}
              color={isInvalid ? "danger" : "default"}
              errorMessage="Please enter a valid Email"
              onValueChange={setEmail}
              isClearable
              isRequired
              size="sm"
              radius="lg"
              type="email"
              variant="bordered"
              label="Email"
              labelPlacement="inside"
              onKeyPress={forgetEmailKeyPress}
            />
            <Button
              variant="flat"
              className={
                sendingOtp
                  ? "w-full bg-white text-primaryColor"
                  : "w-full bg-primaryColor text-bgColor"
              }
              onClick={async () => {
                try {
                  setSendingOtp(true);
                  await handleGenerateNewPassword(
                    email,
                    setForgotPass,
                    setOtpPage,
                  );
                } catch (error) {
                  console.log("Error in sending OTP:", error);
                } finally {
                  setSendingOtp(false);
                }
              }}
            >
              {sendingOtp ? (
                <>
                  <img src="/icons/otp.gif" alt="loading" className="h-full" />
                  Change Password
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </div>
        <p className="text-center text-xs text-textColorLight">
          By clicking continue, you agree to our
          <a href="" className="text-textColorDark">
            {" "}
            Terms of Service{" "}
          </a>
          and
          <a href="" className="text-textColorDark">
            {" "}
            Privacy Policy
          </a>
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="georama-r relative flex h-1/2 w-[30%] min-w-60 flex-col items-center justify-evenly rounded-[20px] bg-bgColor p-[0.75rem] shadow-ourBoxShadow">
        <Link href="/login">
          <Image
            width={100}
            height={100}
            src="/icons/back.png"
            alt="back"
            className="absolute left-[1rem] top-[1rem] w-[30px]"
            onClick={() => {
              setOtpPage(false);
            }}
          />
        </Link>

        <Image
          width={100}
          height={100}
          src="/icons/logo.png"
          alt="logo"
          className="w-[50px]"
        />
        <div className="flex flex-col items-center justify-center">
          <p className="georama-b text-xl">Hey</p>
          <p className="georama-l text-xs">Pls enter OTP sent on your Email</p>
        </div>
        <div className="w-full">
          <div className="otpArea flex items-center justify-center">
            <OtpInput
              value={OTP}
              onChange={(otp) => {
                if (/^\d+$/.test(otp) && otp.length <= otpLength) {
                  setOTP(otp);
                }
              }}
              numInputs={otpLength}
              renderSeparator={<span> </span>}
              renderInput={(props) => <input {...props} />}
            />
          </div>
        </div>
        <div className="flex w-[100%] justify-end gap-[1rem]">
          <p className="text-[13px]">{time > 0 ? formattedTime : ""}</p>
          <Link
            href="/login"
            onClick={() => {
              handleReset(otpGap, time, setTime, setOTP);
            }}
            className={
              time > 0
                ? "cursor-not-allowed text-[13px] text-textColorLight decoration-solid"
                : "text-[13px] text-black decoration-solid"
            }
          >
            Resend OTP
          </Link>
        </div>
        <p className="text-center text-xs text-textColorLight">
          For Testing Purposes Only, enter OTP as <b>"0000"</b>
        </p>
        {/* <p className="text-center text-xs text-textColorLight">
          By clicking continue, you agree to our
          <a href="" className="text-textColorDark">
            {" "}
            Terms of Service{" "}
          </a>
          and
          <a href="" className="text-textColorDark">
            {" "}
            Privacy Policy
          </a>
        </p> */}
      </div>
    </>
  );
}

export default LoginCard;
