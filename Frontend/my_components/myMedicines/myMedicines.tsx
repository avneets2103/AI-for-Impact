import { BACKEND_URI } from "@/CONSTANTS";
import { logout } from "@/Helpers/logout";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import MyMedicineTop from "./myMedicineTop";
import MyMedicinesHero from "./myMedicinesHero";
import { Medicine } from "@/Interfaces";

function MyMedicines() {
  const [medicine, setMedicine] = React.useState<Array<Medicine>>([]);
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
    const getMedicines = async () => {
      try {
        const medicineRes = await axios.post(
          `${BACKEND_URI}/patient/getMedicines`, {}
        );
        const medicineList = medicineRes.data.data.medicinesList;
        const newMedicineList:Medicine[] = [];
        for (const medicine of medicineList) {
          const newMed:Medicine = {
            id: medicine.id,
            medicine: medicine.medicine,
            dosage: medicine.dosage,
            doctor: medicine.doctor,
            status: medicine.status,
          };
          newMedicineList.push(newMed);
        }
        setMedicine(newMedicineList);
      } catch (error) {
        console.log(error);
      }
    };
    getMedicines();
    checkTokens();
    setTimeout(async () => {}, 500);
  }, [Router]);

  return (
    <div className="width-full mr-6 flex h-full flex-grow flex-col">
        <MyMedicineTop/>
        <MyMedicinesHero medicine={medicine} setMedicine={setMedicine}/>
    </div>
  );
}

export default MyMedicines;
