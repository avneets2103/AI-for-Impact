import { BACKEND_URI } from "@/CONSTANTS";
import { logout } from "@/Helpers/logout";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import MyMedicineTop from "./myMedicineTop";
import MyMedicinesHero from "./myMedicinesHero";

function MyMedicines() {
  const Router = useRouter();
  useEffect(() => {
    const checkTokens = async () => {
      try {
        const accessTokenResponse = await axios.post(
          `${BACKEND_URI}/auth/verifyAccessToken`,
        );
        if (accessTokenResponse.status !== 200) {
          Router.push("/login");
          logout();
          return;
        }
        if (accessTokenResponse.data.data.isDoctor) {
          Router.push("sections/myPatients");
        }
      } catch (error) {
        Router.push("/login");
        logout();
        console.log("Access token invalid, trying refresh token...");
      }
    };
    checkTokens();
    setTimeout(async () => {}, 500);
  }, [Router]);

  return (
    <div className="width-full mr-6 flex h-full flex-grow flex-col">
        <MyMedicineTop/>
        <MyMedicinesHero/>
    </div>
  );
}

export default MyMedicines;
