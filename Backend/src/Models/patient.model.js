import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    imageLink: {
        type: String,
    },
    sex: {
        type: String,
        required: true,
        enum: ['M', 'F'],
    },
    age: {
        type: Number,
        required: true,
    },
    currentCondition: {
        type: String,
        trim: true,
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    absoluteSummary: {
        type: String,
        trim: true,
        default: "",
    },
    lastAbsoluteSummary: {
        type: String,
        trim: true,
        default: "",
    },
    medicalHistorySummary: {
        type: String,
        trim: true,
    },
    currentSymptomsSummary: {
        type: String,
        trim: true,
    },
    assistiveDiagnosis: {
        type: String,
        trim: true,
    },
    reportsList: [
        {
            reportName: {
                type: String,
                required: true,
            },
            reportDate: {
                type: String,
                required: true,
            },
            location: {
                type: String,
                required: true,
            },
            reportPDFLink: {
                type: String,
                required: true,
            },
            reportPDFText: {
                type: String,
            },
            reportSummary: {
                type: String,
            }
        }
    ],
    doctorsList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
        }
    ],
    chartsList: [
        {
            chartName: {
                type: String,
                required: true,
            },
            data: [
                {
                    type: {
                        date: {
                            type: String,
                            required: true,
                        },
                        value: {
                            type: Number,
                            required: true,
                        }
                    }
                }
            ],
            queryText: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                default: "",
            },
            sourceList: [
                {
                    type: String,
                }
            ],
            unit: {
                type: String,
            }
        }
    ],
    doctorsNotes: [
        {
            type: {
                doctor: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Doctor',
                    required: true
                },
                note: {
                    type: String
                }
            }
        }
    ],
}, { timestamps: true });

export const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
