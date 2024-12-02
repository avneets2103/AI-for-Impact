import { BACKEND_URI } from "@/CONSTANTS";
import { DocSchema, PatientDataSchema, PatientSchema, ReportsSchema } from "@/Interfaces";
import axios from "@/utils/axios";
import { Toast, ToastInfo } from "./toastError";
import exp from "constants";

const getDocList = async (
  setDocList: React.Dispatch<React.SetStateAction<DocSchema[]>>,
) => {
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
};

const getPatList = async (setPatList: React.Dispatch<React.SetStateAction<Array<PatientSchema>>>) => {
  const patListResponse = await axios.post(`${BACKEND_URI}/doctor/getPatientList`);
  const tempPatList: Array<PatientSchema> = [];
  for(const pat of patListResponse.data.data){
    const tempPat: PatientSchema = {
      id: pat._id,
      name: pat.name,
      imageLink: pat.imageLink,
      sex: pat.sex,
      age: pat.age,
      bloodGroup: pat.bloodGroup, 
      absoluteSummary: pat.absoluteSummary,
    }
    tempPatList.push(tempPat);
  }
  setPatList(tempPatList);
}

const removeDoctor = async(id: string, setDocList: React.Dispatch<React.SetStateAction<DocSchema[]>>) => {
  await axios.post(`${BACKEND_URI}/patient/removeDoctor`, {
    doctorId: id
  })
  getDocList(setDocList);
  ToastInfo("Doctor removed successfully");
}

const removePatient = async(id: string, setPatList: React.Dispatch<React.SetStateAction<Array<PatientSchema>>>) => {
  await axios.post(`${BACKEND_URI}/doctor/removePatient`, {
    patientId: id
  })
  getPatList(setPatList);
  ToastInfo("Patient removed successfully");
}

const getUserDetails = async (setName: React.Dispatch<React.SetStateAction<string>>, setEmail: React.Dispatch<React.SetStateAction<string>>, setIsDoc: React.Dispatch<React.SetStateAction<boolean>>, setDoctorDetails: React.Dispatch<React.SetStateAction<any>>, setPatientDetails: React.Dispatch<React.SetStateAction<any>>, setImageLink: React.Dispatch<React.SetStateAction<string>>) => {
  const response = await axios.post(`${BACKEND_URI}/auth/getUserData`);
  setName(response.data.data.name);
  setEmail(response.data.data.email);
  setIsDoc(response.data.data.isDoctor);
  setImageLink(response.data.data.imageLink);
  if(response.data.data.isDoctor){
    const docDets = {
      qualifications: response.data.data.qualification,
      experience: response.data.data.experience,
      speciality: response.data.data.speciality,
      hospitalNumber: response.data.data.hospitalNumber
    }
    setDoctorDetails(docDets);
  }else{
    const patDets = {
      sex: response.data.data.sex,
      age: response.data.data.age,
      bloodGroup: response.data.data.bloodGroup
    }
    setPatientDetails(patDets);
  }
}

const updatePassword = async (password: string) => {  
  await axios.post(`${BACKEND_URI}/auth/updatePassword`, {
    password
  })
}

const getReportsList = async (setReportsList: React.Dispatch<React.SetStateAction<ReportsSchema[]>>) => {
  const response = await axios.post(`${BACKEND_URI}/patient/getReportList`);
  setReportsList(response.data.data);
}

const getPatientMedical = async (patientId: string, setPatientData: React.Dispatch<React.SetStateAction<PatientDataSchema>>, setDoctorNotes: React.Dispatch<React.SetStateAction<string>>) => {
  const response = await axios.post(`${BACKEND_URI}/doctor/getPatientMedical`, {
    patientId
  })
  setPatientData(response.data.data);
  setDoctorNotes(response.data.data.note);
}

export { getDocList, getPatList, removeDoctor, removePatient, getUserDetails, updatePassword, getReportsList, getPatientMedical };
