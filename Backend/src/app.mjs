import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// handling middlewares
app.use(cors());
app.use(express.json({
    limit: "16kb"
}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use(express.static("public"));
app.use(cookieParser());

// user route
import userRouter from "./Routes/user.routes.mjs"
app.use("/api/v1/auth", userRouter);

// patient route
import patientRouter from "./Routes/patient.routes.mjs"
app.use("/api/v1/patient", patientRouter);

// doctor route
import doctorRouter from "./Routes/doctor.routes.mjs"
app.use("/api/v1/doctor", doctorRouter);

export {app}