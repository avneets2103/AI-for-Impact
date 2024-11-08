import React, { useEffect } from "react";
import MyDocTop from "./myDocTop";
import DocHero from "./DocHero";
import axios from "@/utils/axios";
import { BACKEND_URI } from "@/CONSTANTS";
import { useRouter } from "next/navigation";
import { logout } from "@/Helpers/logout";
import { DocSchema } from "@/Interfaces";
import { getDocList } from "@/Helpers/apiCalls";

function MyDoctors() {
  const Router = useRouter();
  const [searchDoc, setSearchDoc] = React.useState<string>("");
  const [docList, setDocList] = React.useState<Array<DocSchema>>([]);
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
    getDocList(setDocList);
  }, [Router]);

  return (
    <div className="width-full mr-6 flex h-full flex-grow flex-col">
      <MyDocTop searchDoc={searchDoc} setSearchDoc={setSearchDoc} setDocList = {setDocList}/>
      <DocHero data={docList} searchDoc={searchDoc} setDocList={setDocList}/>
    </div>
  );
}

export default MyDoctors;
