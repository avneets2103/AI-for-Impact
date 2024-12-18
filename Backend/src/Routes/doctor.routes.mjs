import { Router } from "express";

import { verifyJWT } from "../Middlewares/auth.middleware.mjs";
import { addMedicine, emptyMedicineList, generatePatientCode, getPatientList, getPatientMedical, removeMedicine, removePatient, saveDoctorNote } from "../Controllers/doctor.controller.mjs";

const router = Router();

// secured routs
router.route("/getPatientList").post(verifyJWT, getPatientList);
router.route("/generatePatientCode").post(verifyJWT, generatePatientCode);
router.route("/getPatientMedical").post(verifyJWT, getPatientMedical);
router.route("/removePatient").post(verifyJWT, removePatient);
router.route("/saveDoctorNote").post(verifyJWT, saveDoctorNote);  
router.route("/addMedicine").post(verifyJWT, addMedicine);
router.route("/removeMedicine").post(verifyJWT, removeMedicine);  
router.route("/emptyMedicineList").post(verifyJWT, emptyMedicineList);

export default router;