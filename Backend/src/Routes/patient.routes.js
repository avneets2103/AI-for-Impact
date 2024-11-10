import { Router } from "express";

import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { acceptChart, addChatReport, addDoctor, addReport, getDoctorList, getReportList, queryDateVal, queryReports, removeDoctor, removeReport, reportAddSignedURL, getCharts } from "../Controllers/patient.controller.js";

const router = Router();

// secured routs
router.route("/getDoctorList").post(verifyJWT, getDoctorList);
router.route("/addDoctor").post(verifyJWT, addDoctor);
router.route("/getReportList").post(verifyJWT, getReportList);
router.route("/addReport").post(verifyJWT, addReport);
router.route("/addChatReport").post(verifyJWT, addChatReport);
router.route("/removeDoctor").post(verifyJWT, removeDoctor);
router.route("/reportAddSignedURL").post(verifyJWT, reportAddSignedURL);
router.route("/removeReport").post(verifyJWT, removeReport);
router.route("/queryReports").post(verifyJWT, queryReports);
router.route("/queryDateVal").post(verifyJWT, queryDateVal);
router.route("/acceptChart").post(verifyJWT, acceptChart);
router.route("/getCharts").post(verifyJWT, getCharts);

export default router;