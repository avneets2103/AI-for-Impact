"use client"
import { BACKEND_URI } from '@/CONSTANTS';
import { logout } from '@/Helpers/logout';
import axios from '@/utils/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * This page is rendered when a user navigates to a route that doesn't
 * exist in the app. It verifies the access token and redirects the user
 * to their respective section.
 */
export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    /**
     * Verifies the access token and redirects the user to the login page
     * if it's invalid. If the token is valid, it redirects the user to their
     * respective section.
     */
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "black",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "5rem", color: "#ff6b6b", margin: 0 }}>OOPSIES!</h1>
      <p style={{ fontSize: "1.5rem", color: "#555", margin: "20px 0" }}>
        Sorry, we couldn't find the page you're looking for.
      </p>
    </div>
  );
}
