interface sidebarRTK { 
    currentPage: string,
    currentList: string,
};

interface sidebarMenuItems {
    name: string,
    path: string,
    iconS: string,
    iconNS: string,
    iconNSD: string,
    patient: Boolean,
}

interface DocSchema{
    id: string;
    name: string;
    speciality:string;
    qualifications: string;
    imageLink: string;
    experience: string;
    hospitalNumber: string, 
}

interface PatientSchema{
    id: string;
    name: string;
    sex: string;
    age: string;
    imageLink: string;
    bloodGroup: string;
    currentCondition?: string;
    medicalHistorySummary?: string;
    currentSymptomsSummary?: string;
    assistiveDiagnosis?: string;
    reportsList?: any;
    absoluteSummary: string;
}

interface ReportsSchema {
    id: string;
    reportName: string;
    reportDate: string;
    location: string;
    reportPDFLink: string;
    reportSummary: string;
}

// TODO: Add queryText, sourceList, unit
interface GraphSchema{
    id: string;
    name: string;
    data: {
        date: string;
        value: number;
    }[];
    description: string;
    sourceList: string[];
    unit: string;
    queryText: string;
} 

interface Message {
    text: string;
    sender: 'not_user' | 'user';
}

interface PatientDataSchema {
    sex: string;
    age: string;
    bloodGroup: string;
    condition: string;
    medicalHistory: string,
    currentSymptoms: string,
    reportsList: ReportsSchema[],
    absoluteSummary: string,
    note: string,
    chartsList: GraphSchema[]
}

export type {
    sidebarRTK,
    sidebarMenuItems, 
    DocSchema,
    PatientSchema,
    ReportsSchema,
    GraphSchema,
    Message,
    PatientDataSchema,
    
}