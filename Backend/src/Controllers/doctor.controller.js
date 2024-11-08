import { asyncHandler } from '../Utils/asyncHandler.js';
import ApiError from '../Utils/ApiError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import { User } from '../Models/user.model.js';
import { Patient } from '../Models/patient.model.js';
import { Doctor } from '../Models/doctor.model.js';
import jwt from 'jsonwebtoken';
import { sendingMail } from '../Utils/messagingService.js';
import { getObjectURL } from '../Utils/s3.js';

const generateDoctorToken = async (doctor, patient) => {
    try {
        const doctorToken = await jwt.sign(
            {
                doctorId: doctor._id,
                patientId: patient._id
            },
            process.env.DOCTOR_TOKEN_SECRET,
            {
                expiresIn: process.env.DOCTOR_TOKEN_EXPIRY
            }
        )
        return doctorToken;
    } catch (error) {
        throw new ApiError(
            500,
            'Something went wrong while generating refresh and access token'
        )
    }
}

const getPatientList = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('doctorDetails');

        if (!user || !user.doctorDetails) {
            throw new ApiError(404, 'Doctor not found');
        }

        const doctor = await Doctor.findById(user.doctorDetails._id).populate('patientsList');
        if (!doctor) {
            throw new ApiError(404, 'Doctor details not found');
        }

        const patientList = [];
        for (const patient of doctor.patientsList) {
            patient.imageLink = await getObjectURL(patient.imageLink);
            patient.doctorsList = [];
            patientList.push(patient);
        }

        return res.status(200).json(
            new ApiResponse(200, patientList, 'Patient list retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Something went wrong in getPatientList');
    }
});

const generatePatientCode = asyncHandler(async (req, res) => {
    try {
        const {patientMail} = req.body;
        const patientUser = await User.findOne({email: patientMail});
        if (!patientUser) {
            throw new ApiError(404, 'Patient not found');
        }
        const doctorToken = await generateDoctorToken(req.user.doctorDetails, patientUser.patientDetails);

        sendingMail(patientMail, "Doctor Token", 'Your Doctor Token is:', `${doctorToken}`);
        return res.status(200).json(
            new ApiResponse(200, doctorToken, 'Patient code generated successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Something went wrong in generatePatientCode');
    }
});

const getPatientMedical = asyncHandler(async (req, res) => {
    try {
        const {patientId} = req.body;
        const patient = await Patient.findById(patientId);
        if (!patient) {
            throw new ApiError(404, 'Patient not found');
        }
        if (!patient.doctorsList.includes(req.user.doctorDetails._id)) {
            throw new ApiError(401, 'Unauthorized access');
        }
        const reportList = [];
        for (const report of patient.reportsList) {
        report.reportPDFLink = await getObjectURL(report.reportPDFLink);
        reportList.push(report);
        }
        reportList.reverse();
        const response = {
            sex: patient.sex,
            age: patient.age,
            bloodGroup: patient.bloodGroup,
            condition: patient.assistiveDiagnosis || "",
            medicalHistory: patient.medicalHistorySummary || "",
            currentSymptoms: patient.currentSymptomsSummary || "",
            reportsList: reportList,
        }
        return res.status(200).json(
            new ApiResponse(200, response, 'Patient medical history retrieved successfully')
        );

    }catch (error) {
        throw new ApiError(500, 'Something went wrong in getPatientMedical');
    }
})

const removePatient = asyncHandler(async (req, res) => {
    try {
        const { patientId } = req.body;
        const user = await User.findById(req.user._id).populate('doctorDetails');
        if (!user || !user.doctorDetails) {
            throw new ApiError(404, 'Doctor not found');
        }
        const doctor = await Doctor.findById(user.doctorDetails._id);
        const index = doctor.patientsList.indexOf(patientId);
        if (index > -1) {
            doctor.patientsList.splice(index, 1);
            await doctor.save();
        }
        const patient = await Patient.findById(patientId);
        const index2 = patient.doctorsList.indexOf(user.doctorDetails._id);
        if (index2 > -1) {
            patient.doctorsList.splice(index2, 1);
            await patient.save();
        }
        return res.status(200).json(
            new ApiResponse(200, {
                patientsList: doctor.patientsList,
                doctorsList: patient.doctorsList    
            }, 'Patient removed successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Something went wrong in removePatient');
    }    
});

export {
    getPatientList,
    generatePatientCode,
    getPatientMedical,
    removePatient
};