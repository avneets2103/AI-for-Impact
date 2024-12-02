import { Medicine } from "@/Interfaces";


const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "Medicine", uid: "medicine", sortable: true},
  {name: "Dosage", uid: "dosage"},
  {name: "Doctor", uid: "doctor", sortable: true},
  {name: "STATUS", uid: "status", sortable: true},
  // {name: "", uid: "actions"},
];

const statusOptions = [
  {name: "Taken", uid: "taken"},
  {name: "Pending", uid: "pending"},
];

const medicine: Medicine[] = [
  {
    id: "1",
    medicine: "Aspirin",
    dosage: "100mg Morning, 200mg Night",
    doctor: "Dr. Michael Smith",
    status: "taken",
  },
  {
    id: "2",
    medicine: "Ibuprofen",
    dosage: "150mg Morning, 150mg Afternoon",
    doctor: "Dr. Sarah Johnson",
    status: "taken",
  },
  {
    id: "3",
    medicine: "Paracetamol",
    dosage: "500mg Morning",
    doctor: "Dr. Emily Davis",
    status: "pending",
  },
  {
    id: "4",
    medicine: "Amoxicillin",
    dosage: "250mg Afternoon, 250mg Night",
    doctor: "Dr. John Brown",
    status: "pending",
  },
  {
    id: "5",
    medicine: "Metformin",
    dosage: "500mg Morning, 500mg Evening",
    doctor: "Dr. Jennifer Lee",
    status: "taken",
  },
  {
    id: "6",
    medicine: "Lisinopril",
    dosage: "10mg Morning",
    doctor: "Dr. Robert Wilson",
    status: "taken",
  },
  {
    id: "7",
    medicine: "Atorvastatin",
    dosage: "20mg Night",
    doctor: "Dr. Patricia Moore",
    status: "taken",
  },
  {
    id: "8",
    medicine: "Simvastatin",
    dosage: "40mg Morning",
    doctor: "Dr. William Taylor",
    status: "taken",
  },
  {
    id: "9",
    medicine: "Ciprofloxacin",
    dosage: "500mg Morning, 500mg Evening",
    doctor: "Dr. Thomas Harris",
    status: "taken",
  },
  {
    id: "10",
    medicine: "Prednisone",
    dosage: "10mg Afternoon, 10mg Night",
    doctor: "Dr. Elizabeth Clark",
    status: "pending",
  },
  {
    id: "11",
    medicine: "Clindamycin",
    dosage: "300mg Morning",
    doctor: "Dr. Daniel Lewis",
    status: "pending",
  },
  {
    id: "12",
    medicine: "Atenolol",
    dosage: "50mg Morning",
    doctor: "Dr. Laura Walker",
    status: "pending",
  },
  {
    id: "13",
    medicine: "Gabapentin",
    dosage: "100mg Morning, 100mg Evening",
    doctor: "Dr. Anthony Scott",
    status: "taken",
  },
  {
    id: "14",
    medicine: "Hydrochlorothiazide",
    dosage: "25mg Morning",
    doctor: "Dr. Nancy King",
    status: "taken",
  },
];


export {columns, medicine, statusOptions};