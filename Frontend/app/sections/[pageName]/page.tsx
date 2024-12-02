"use client";
import React, { useEffect } from "react";
import axios from "@/utils/axios";
import { useDispatch } from "react-redux";
import "./page.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/my_components/sidebar/sidebar";
import MyDoctors from "@/my_components/myDoctors/myDoctors";
import ReportMain from "@/my_components/myReports/meReports";
import SupportMain from "@/my_components/medicalSupport/medicalSupport";

import { BACKEND_URI } from "@/CONSTANTS";
import { logout } from "@/Helpers/logout";
import { setCurrentPage } from "@/RTK/features/sidebar";
import { useRouter } from "next/navigation";
import VitalsMain from "@/my_components/healthVitals/heathVitals";
import DoctorsPatient from "@/my_components/DoctorsPatients/DoctorsPatient";
import MyMedicines from "@/my_components/myMedicines/myMedicines";

function Page({ params }: any) {
  const Router = useRouter();
  const dispatcher = useDispatch();
  const currentPage = params.pageName;

  useEffect(() => {
    /*** Set the current page name in the Redux store. */
    dispatcher(setCurrentPage({ currentPage: currentPage }));

    /**
     * If the current page is not one of the valid pages, check if the access token
     * is valid. If not, log the user out and redirect them to the login page.
     */
    if (
      ![
        "myDoctors",
        "myReports",
        "healthVitals",
        "medicalSupport",
        "myMedicines",
        "myPatients",
      ].includes(currentPage)
    ) {
      const checkTokens = async () => {
        try {
          // Verify access token
          const accessTokenResponse = await axios.post(
            `${BACKEND_URI}/auth/verifyAccessToken`,
          );
          if (accessTokenResponse.status !== 200) {
            // If the access token is invalid, log the user out and
            // redirect them to the login page
            Router.push("/login");
            logout();

            return;
          }
          // If the user is a doctor, redirect them to the My Patients page
          if (accessTokenResponse.data.data.isDoctor) {
            Router.push("/sections/myPatients");
          } else {
            // If the user is a patient, redirect them to the My Doctors page
            Router.push("/sections/myDoctors");
          }
        } catch (error) {
          // If there is an error, log the user out and redirect them to
          // the login page
          Router.push("/login");
          logout();
          console.log("Access token invalid, trying refresh token...");
        }
      };
      checkTokens();
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-bgColor">
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
      <Sidebar />
      {currentPage === "myDoctors" && <MyDoctors />}
      {currentPage === "myReports" && <ReportMain />}
      {currentPage === "healthVitals" && <VitalsMain />}
      {currentPage === "medicalSupport" && <SupportMain/>}
      {currentPage === "myMedicines" && <MyMedicines />}
      {currentPage === "myPatients" && <DoctorsPatient />}
    </div>
  );
}export default Page;
