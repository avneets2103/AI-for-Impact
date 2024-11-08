"use client";
import { BACKEND_URI } from "@/CONSTANTS";
import { logout } from "@/Helpers/logout";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
  const verifyAccessToken = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/auth/verifyAccessToken`);

      if (response.status !== 200) {
        logout();
        router.push("/login");
        return;
      }

      if (response.data.data.isDoctor) {
        router.push("/sections/myPatients");
      } else {
        router.push("/sections/myDoctors");
      }
    } catch (error) {
      logout();
      router.push("/login");
    }
  };
  verifyAccessToken();
  }, [router]);
  return (
    <>
    </>
  );
}