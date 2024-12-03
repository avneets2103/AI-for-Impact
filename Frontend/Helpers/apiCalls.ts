import { BACKEND_URI } from "@/CONSTANTS";
import {
  DocSchema,
  Medicine,
  PatientDataSchema,
  PatientSchema,
  ReportsSchema,
} from "@/Interfaces";
import axios from "@/utils/axios";
import { Toast, ToastErrors, ToastInfo } from "./toastError";
import exp from "constants";

const getDocList = async (
  setDocList: React.Dispatch<React.SetStateAction<DocSchema[]>>,
) => {
  try {
    const docListResponse = await axios.post(
      `${BACKEND_URI}/patient/getDoctorList`,
    );
    const tempDocList: Array<DocSchema> = [];
    for (const doc of docListResponse.data.data) {
      const tempDoc: DocSchema = {
        id: doc._id,
        name: doc.name,
        imageLink: doc.imageLink,
        speciality: doc.speciality,
        qualifications: doc.qualifications,
        experience: doc.experience,
        hospitalNumber: doc.hostpitalNumber,
      };
      tempDocList.push(tempDoc);
    }
    setDocList(tempDocList);
  } catch (error) {
    ToastErrors("Error getting doctor list");
  }
};

const getPatList = async (
  setPatList: React.Dispatch<React.SetStateAction<Array<PatientSchema>>>,
) => {
  try {
    const patListResponse = await axios.post(
      `${BACKEND_URI}/doctor/getPatientList`,
    );
    const tempPatList: Array<PatientSchema> = [];
    for (const pat of patListResponse.data.data) {
      const tempPat: PatientSchema = {
        id: pat._id,
        name: pat.name,
        imageLink: pat.imageLink,
        sex: pat.sex,
        age: pat.age,
        bloodGroup: pat.bloodGroup,
        absoluteSummary: pat.absoluteSummary,
      };
      tempPatList.push(tempPat);
    }
    setPatList(tempPatList);
  } catch (error) {
    ToastErrors("Error getting patient list");
  }
};

const removeDoctor = async (
  id: string,
  setDocList: React.Dispatch<React.SetStateAction<DocSchema[]>>,
) => {
  try {
    await axios.post(`${BACKEND_URI}/patient/removeDoctor`, {
      doctorId: id,
    });
    getDocList(setDocList);
    ToastInfo("Doctor removed successfully");
  } catch (error) {
    ToastErrors("Error removing doctor");
  }
};

const removePatient = async (
  id: string,
  setPatList: React.Dispatch<React.SetStateAction<Array<PatientSchema>>>,
) => {
  try {
    await axios.post(`${BACKEND_URI}/doctor/removePatient`, {
      patientId: id,
    });
    getPatList(setPatList);
    ToastInfo("Patient removed successfully");
  } catch (error) {
    ToastErrors("Error removing patient");
  }
};

const getUserDetails = async (
  setName: React.Dispatch<React.SetStateAction<string>>,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setIsDoc: React.Dispatch<React.SetStateAction<boolean>>,
  setDoctorDetails: React.Dispatch<React.SetStateAction<any>>,
  setPatientDetails: React.Dispatch<React.SetStateAction<any>>,
  setImageLink: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    const response = await axios.post(`${BACKEND_URI}/auth/getUserData`);
    setName(response.data.data.name);
    setEmail(response.data.data.email);
    setIsDoc(response.data.data.isDoctor);
    setImageLink(response.data.data.imageLink);
    if (response.data.data.isDoctor) {
      const docDets = {
        qualifications: response.data.data.qualification,
        experience: response.data.data.experience,
        speciality: response.data.data.speciality,
        hospitalNumber: response.data.data.hospitalNumber,
      };
      setDoctorDetails(docDets);
    } else {
      const patDets = {
        sex: response.data.data.sex,
        age: response.data.data.age,
        bloodGroup: response.data.data.bloodGroup,
      };
      setPatientDetails(patDets);
    }
  } catch (error) {
    ToastErrors("Error getting user details");
  }
};

const updatePassword = async (password: string) => {
  try {
    await axios.post(`${BACKEND_URI}/auth/updatePassword`, {
      password,
    });
  } catch (error) {
    ToastErrors("Error updating password");
  }
};

const getReportsList = async (
  setReportsList: React.Dispatch<React.SetStateAction<ReportsSchema[]>>,
) => {
  try {
    const response = await axios.post(`${BACKEND_URI}/patient/getReportList`);
    setReportsList(response.data.data);
  } catch (error) {
    ToastErrors("Error getting report list");
  }
};

const getPatientMedical = async (
  patientId: string,
  setPatientData: React.Dispatch<React.SetStateAction<PatientDataSchema>>,
  setDoctorNotes: React.Dispatch<React.SetStateAction<string>>,
  setMedicine: React.Dispatch<React.SetStateAction<Medicine[]>>,
) => {
  try {
    const response = await axios.post(
      `${BACKEND_URI}/doctor/getPatientMedical`,
      {
        patientId,
      },
    );
    const medicineRes = await axios.post(
      `${BACKEND_URI}/patient/getMedicines`,
      {
        patientId,
      },
    );
    const medicineList = medicineRes.data.data.medicinesList;
    const newMedicineList: Medicine[] = [];
    for (const medicine of medicineList) {
      const newMed: Medicine = {
        id: medicine.id,
        medicine: medicine.medicine,
        dosage: medicine.dosage,
        doctor: medicine.doctor,
        status: medicine.status,
        doctorId: medicine.doctorId,
      };
      newMedicineList.push(newMed);
    }
    setMedicine(newMedicineList);
    setPatientData(response.data.data);
    setDoctorNotes(response.data.data.note);
  } catch (error) {
    ToastErrors("Error getting patient medical");
  }
};

export {
  getDocList,
  getPatList,
  removeDoctor,
  removePatient,
  getUserDetails,
  updatePassword,
  getReportsList,
  getPatientMedical,
};
