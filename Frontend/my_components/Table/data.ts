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


export {columns, statusOptions};