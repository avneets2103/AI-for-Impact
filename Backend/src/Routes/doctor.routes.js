import { Router } from "express";

import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { generatePatientCode, getPatientList, getPatientMedical, removePatient, saveDoctorNote } from "../Controllers/doctor.controller.js";

const router = Router();

// secured routs
router.route("/getPatientList").post(verifyJWT, getPatientList);
router.route("/generatePatientCode").post(verifyJWT, generatePatientCode);
router.route("/getPatientMedical").post(verifyJWT, getPatientMedical);
router.route("/removePatient").post(verifyJWT, removePatient);
router.route("/saveDoctorNote").post(verifyJWT, saveDoctorNote);    

export default router;