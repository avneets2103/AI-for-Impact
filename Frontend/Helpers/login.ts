import axios from "axios";
import { BACKEND_URI, minPassLength } from "@/CONSTANTS";
import { ToastErrors, ToastInfo } from "./toastError";
import Cookies from "js-cookie";

const validateEmail = (value: string): boolean => 
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(value);


function passIsValid(password: string): boolean {
    return password.length >= minPassLength || password.length === 0;
}

const handleLogin = async(isInvalid: boolean, password: string, email: string, setOtpPage: Function) => { 
    if(!isInvalid && (password.length >= minPassLength)) {
        try {
            const user = {
                email: email.trim(),
                password: password,
            };
            const loginRes = await axios.post(`${BACKEND_URI}/auth/login`, user); 
            Cookies.set("newUser", loginRes.data.data.newUser);
            setOtpPage(true);
          } catch (error: any) {
            ToastErrors("Invalid Login Credentials!");
          }
    }else {
        if (isInvalid && !(password.length >= minPassLength)) {
          ToastErrors("Email and Password invalid!");
        } else if (isInvalid) {
          ToastErrors("Email invalid!");
        } else {
          ToastErrors("Password invalid!");
        }
    }
};

const handleReset = async (otpGap: number, time: number, setTime: Function, setOTP: Function) => {
  if (time > 0) {
    return;
  }
  try {
    const body = {
      email: Cookies.get("email") || "",
    };
    await axios.post(
      `${BACKEND_URI}/auth/resendOTP`,  
      body
    );
    ToastInfo("Email sent containing new otp!");
  } catch (error) {
    ToastErrors("OTP resend issue");
  }
  setTime(otpGap);
  setOTP("");
};

const handleForgotPass = (setForgotPass: Function, setOtpPage: Function, setPassword: Function) => {
  setForgotPass(true);
  setOtpPage(false);
  setPassword("");
}

const handleGenerateNewPassword = async (email: string, setForgotPass: Function, setOTP: Function) => {
  try {
    const body = {
      "email": email
    }
    await axios.post(`${BACKEND_URI}/auth/generateNewPassword`, body);
    ToastInfo("New password generated");
    setForgotPass(false);
    setOTP(false);
  } catch (error) {
    ToastInfo("Email not registered, Sign Up first");
  }
}

export { 
    validateEmail, 
    passIsValid, 
    handleLogin,
    handleReset,
    handleForgotPass,
    handleGenerateNewPassword
};