import { asyncHandler } from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { User } from "../Models/user.model.js"; // Ensure correct import paths
import { Patient } from "../Models/patient.model.js";
import { Doctor } from "../Models/doctor.model.js";
import jwt from "jsonwebtoken";
import { extractTextFromPDF, getObjectURL, putObjectURL } from "../Utils/s3.js";
import { makeUniqueFileName } from "../Utils/helpers.js";
import axios from "axios";

const getDoctorList = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("patientDetails");

    if (!user || !user.patientDetails) {
      throw new ApiError(404, "Patient not found");
    }

    const patient = await Patient.findById(user.patientDetails._id).populate(
      "doctorsList"
    );

    if (!patient) {
      throw new ApiError(404, "Patient details not found");
    }

    const doctorList = [];
    for (const doctor of patient.doctorsList) {
      doctor.imageLink = await getObjectURL(doctor.imageLink);
      doctor.patientsList = [];
      doctorList.push(doctor);
    }
    doctorList.reverse();
    return res
      .status(200)
      .json(
        new ApiResponse(200, doctorList, "Doctor list retrieved successfully")
      );
  } catch (error) {
    console.error("Error in getDoctorList:", error); // Log the actual error for better debugging
    throw new ApiError(500, "Something went wrong in getDoctorList");
  }
});

const removeDoctor = asyncHandler(async (req, res) => {
  try {
    const { doctorId } = req.body;
    const user = await User.findById(req.user._id).populate("patientDetails");
    if (!user || !user.patientDetails) {
      throw new ApiError(404, "Patient not found");
    }
    const patient = await Patient.findById(user.patientDetails._id);
    const index = patient.doctorsList.indexOf(doctorId);
    if (index > -1) {
      patient.doctorsList.splice(index, 1);
      await patient.save();
    }
    const doctor = await Doctor.findById(doctorId);
    const index2 = doctor.patientsList.indexOf(patient._id);
    if (index2 > -1) {
      doctor.patientsList.splice(index2, 1);
      await doctor.save();
    }
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          doctorsList: patient.doctorsList,
          patientsList: doctor.patientsList,
        },
        "Doctor removed successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong in removeDoctor");
  }
});

const addDoctor = asyncHandler(async (req, res) => {
  try {
    const { doctorGeneratedOneTimeToken } = req.body;

    // Verify the token
    const decoded = jwt.verify(
      doctorGeneratedOneTimeToken,
      process.env.DOCTOR_TOKEN_SECRET
    );
    const doctorId = decoded.doctorId; // doctor's doctor ID
    const patientId = decoded.patientId; // patient's patient ID

    if (patientId !== req.user.patientDetails._id.toString()) {
      throw new ApiError(401, "Unauthorized access");
    }

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient.doctorsList.includes(doctorId)) {
      patient.doctorsList.push(doctorId);
      await patient.save();
    }

    if (!doctor.patientsList.includes(patientId)) {
      doctor.patientsList.push(patientId);
      await doctor.save();
    }

    // Return the doctor's data
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          doctorPatients: doctor.patientsList,
          patientDoctors: patient.doctorsList,
        },
        "Doctor added successfully"
      )
    );
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new ApiError(401, "Invalid or expired token");
    }
    throw new ApiError(500, "Something went wrong in addDoctor");
  }
});

const getReportList = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("patientDetails");
    if (!user || !user.patientDetails) {
      throw new ApiError(404, "Patient not found");
    }
    const patient = await Patient.findById(user.patientDetails._id).populate(
      "reportsList"
    );
    if (!patient) {
      throw new ApiError(404, "Patient details not found");
    }
    const reportList = [];
    for (const report of patient.reportsList) {
      report.reportPDFLink = await getObjectURL(report.reportPDFLink);
      reportList.push(report);
    }
    reportList.reverse();
    return res
      .status(200)
      .json(
        new ApiResponse(200, reportList, "Report list retrieved successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong in getReportList");
  }
});

const addReport = asyncHandler(async (req, res) => {
  try {
    const { reportName, location, reportDate, reportPDFLink } = req.body;
    const user = await User.findById(req.user._id).populate("patientDetails");

    if (!user || !user.patientDetails) {
      throw new ApiError(404, "Patient not found");
    }
    const patient = await Patient.findById(user.patientDetails._id);
    ("");

    const reportPDFText = await extractTextFromPDF(reportPDFLink);

    // knowledge base update here
    const cntOfReports = patient.reportsList.length;
    let absText = patient.absoluteSummary;
    if(cntOfReports > 0 && cntOfReports % 10 === 0){
      // reset absolute summary
      let newAbsoluteText = "";
      newAbsoluteText += patient.lastAbsoluteSummary;
      let cnt = 9;
      let index = cntOfReports - 1;
      while(index-- && cnt--){
        newAbsoluteText += patient.reportsList[index].reportSummary;
      }
      absText = newAbsoluteText;
    }
    const reportSummary = await axios.post(`${process.env.FLASK_SERVER}/reports/update_kb`, {
      reportText: reportPDFText,
      absoluteText: absText,
    });
    if(cntOfReports > 0 && cntOfReports % 10 === 0){
      patient.lastAbsoluteSummary = reportSummary.data.newAbsoluteText;
    }

    // Add report details to patient's reportsList
    const newReport = {
      reportName,
      reportDate,
      location,
      reportPDFLink,
      reportPDFText,
      reportSummary: reportSummary.data.indReportSummary,
    };
    patient.reportsList.push(newReport);
    patient.absoluteSummary = reportSummary.data.newAbsoluteText;
    await patient.save();

    // report embedding here
    const reportEmbedding = await axios.post(`${process.env.FLASK_SERVER}/reports/embed_report`, {
      reportText: reportPDFText,
      reportId: patient.reportsList[patient.reportsList.length - 1]._id,
      patientId: patient._id,
      url: await getObjectURL(reportPDFLink),
      date: reportDate
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          patient: patient,
          reportSummary: newReport.reportSummary,
        },
        "Report added successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong in addReport");
  }
});

const addChatReport = asyncHandler(async (req, res) => {
  try {
    const { reportDate, reportPDFText } = req.body;
    const user = await User.findById(req.user._id).populate("patientDetails");

    if (!user || !user.patientDetails) {
      throw new ApiError(404, "Patient not found");
    }
    const patient = await Patient.findById(user.patientDetails._id);
    ("");

    // knowledge base update here
    const cntOfReports = patient.reportsList.length;
    let absText = patient.absoluteSummary;
    if(cntOfReports > 0 && cntOfReports % 10 === 0){
      // reset absolute summary
      let newAbsoluteText = "";
      newAbsoluteText += patient.lastAbsoluteSummary;
      let cnt = 9;
      let index = cntOfReports - 1;
      while(index-- && cnt--){
        newAbsoluteText += patient.reportsList[index].reportSummary;
      }
      absText = newAbsoluteText;
    }
    const reportSummary = await axios.post(`${process.env.FLASK_SERVER}/reports/update_kb`, {
      reportText: reportPDFText,
      absoluteText: absText,
    });
    if(cntOfReports > 0 && cntOfReports % 10 === 0){
      patient.lastAbsoluteSummary = reportSummary.data.newAbsoluteText;
    }

    patient.absoluteSummary = reportSummary.data.newAbsoluteText;
    await patient.save();

    // report embedding here
    const reportEmbedding = await axios.post(`${process.env.FLASK_SERVER}/reports/embed_report`, {
      reportText: reportPDFText,
      reportId: "chat based report",
      patientId: patient._id,
      url: "chat based report",
      date: reportDate
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          patient: patient,
        },
        "Chat Report added successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong in addReport");
  }
})

const reportAddSignedURL = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("patientDetails");
    const { reportName } = req.body;
    if (!user || !user.patientDetails) {
      throw new ApiError(404, "Patient not found");
    }
    const patient = await Patient.findById(user.patientDetails._id);
    const nameOfFile = `Reports/${makeUniqueFileName(reportName, user._id.toString())}.pdf`;
    const url = await putObjectURL(nameOfFile, "application/pdf", 600);
    await patient.save();
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          url: url,
          reportPDFLink: nameOfFile,
        },
        "Report signed URL added successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong in reportAddSignedURL");
  }
});

const removeReport = asyncHandler(async (req, res) => {
  try {
    const { reportId } = req.body;
    const user = await User.findById(req.user._id).populate("patientDetails");
    if (!user || !user.patientDetails) {
      throw new ApiError(404, "Patient not found");
    }
    const patient = await Patient.findById(user.patientDetails._id);
    let index = -1;
    let i = 0;
    for (const report of patient.reportsList) {
      if (report._id.toString() === reportId) {
        index = i;
        break;
      }
      i++;
    }
    if (index > -1) {
      patient.reportsList.splice(index, 1);
      await patient.save();
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, patient.reportsList, "Report removed successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong in removeReport");
  }
});

const queryReports = asyncHandler(async (req, res) => {
  try {
    let { patientId, queryText } = req.body;
    if(!req.user.isDoctor){
      patientId = req.user.patientDetails._id;
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    const queryRes = await axios.post(`${process.env.FLASK_SERVER}/reports/generalReportQuery`, {
      patientId,
      queryText,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, {
          response: queryRes.data.response,
          sources: queryRes.data.sources,
        }, "Report list retrieved successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong in getReportList");
  }
});

const queryDateVal = asyncHandler(async (req, res) => {
  try {
    let { patientId, queryText } = req.body;
    if(!req.user.isDoctor){
      patientId = req.user.patientDetails._id;
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    const queryRes = await axios.post(`${process.env.FLASK_SERVER}/reports/dateValQuery`, {
      patientId,
      queryText,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, queryRes.data, "Report list retrieved successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong in getReportList");
  }
});

const acceptChart = asyncHandler(async (req, res) => {
  try {
    const {patientId, chartName, data, queryText, description, sourceList, unit} = req.body;
    if(!req.user.isDoctor){
      patientId = req.user.patientDetails._id;
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    const chart = await Patient.findOneAndUpdate(
      { _id: patientId },
      {
        $push: {
          chartsList: {
            chartName,
            data,
            queryText,
            description,
            sourceList,
            unit
          }
        }
      },
      { new: true }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          patient: chart,
        },
        "Chart added successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong in Accept Chart");
  }
});

export {
  getDoctorList,
  addDoctor,
  getReportList,
  addReport,
  removeDoctor,
  reportAddSignedURL,
  removeReport,
  queryReports,
  queryDateVal, 
  acceptChart,
  addChatReport
};
