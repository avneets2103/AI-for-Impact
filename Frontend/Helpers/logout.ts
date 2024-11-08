import axios from "@/utils/axios";
import { BACKEND_URI } from "@/CONSTANTS";
import Cookies from "js-cookie";

export const logout = async () => {
    await axios.post(`${BACKEND_URI}/auth/logout`);
    Cookies.remove("avatarNumber");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("isDoctor");
    Cookies.remove("email"); 
}