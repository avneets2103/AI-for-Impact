import { sidebarMenuItems } from "./Interfaces";

const minPassLength = 6;
const BACKEND_URI="http://localhost:4000/api/v1" // local
// const BACKEND_URI = "https://medical-sih-app.onrender.com/api/v1"; // render
// const BACKEND_URI = "https://btp-web-ci2r.vercel.app/api/v1"; // vercel
const FLASK_SERVER = "http://127.0.0.1:5555/api/v1"
const otpLength = 4;
const otpGap = 60;
const accessTokenExpiration = 60 * 60 * 24 * 100; // 7 days
const refreshTokenExpiration = 60 * 60 * 24 * 200; // 30 days

const sidebarMenu:Array<sidebarMenuItems>= [
    {
        name: "My Doctors",
        path: "myDoctors",
        iconS: "/icons/doc.s.png",
        iconNS: "/icons/doc.ns.png",
        iconNSD: "/icons/doc.ns.D.png",
        patient: true,
    },
    {
        name: "My Reports",
        path: "myReports",
        iconS: "/icons/rep.s.png",
        iconNS: "/icons/rep.ns.png",
        iconNSD: "/icons/rep.ns.D.png",
        patient: true,
    },
    {
        name: "Health Vitals",
        path: "healthVitals",
        iconS: "/icons/vitals.s.png",
        iconNS: "/icons/vitals.ns.png",
        iconNSD: "/icons/vitals.ns.D.png",
        patient: true,
    },
    {
        name: "24x7 Support",
        path: "medicalSupport",
        iconS: "/icons/sup.s.png",
        iconNS: "/icons/sup.ns.png",
        iconNSD: "/icons/sup.ns.D.png",
        patient: true,
    },
    {
        name: "My Patients",
        path: "myPatients",
        iconS: "/icons/patient.s.png",
        iconNS: "/icons/patient.ns.png",
        iconNSD: "/icons/patient.ns.D.png",
        patient: false,
    },
]

export { 
    BACKEND_URI,
    FLASK_SERVER,
    minPassLength,
    otpLength,
    otpGap,
    sidebarMenu,
    accessTokenExpiration,
    refreshTokenExpiration
};