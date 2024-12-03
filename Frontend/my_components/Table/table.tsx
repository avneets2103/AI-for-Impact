import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Selection,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { SearchIcon } from "./SearchIcon";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import { Medicine, PatientDataSchema } from "@/Interfaces";
import axios from "@/utils/axios";
import { BACKEND_URI } from "@/CONSTANTS";
import { getPatientMedical } from "@/Helpers/apiCalls";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { ToastErrors } from "@/Helpers/toastError";

const statusColorMap: Record<string, ChipProps["color"]> = {
  taken: "success",
  pending: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "medicine",
  "dosage",
  "doctor",
  "status",
  "actions",
];

interface Props {
  medicine: Medicine[];
  setMedicine: React.Dispatch<React.SetStateAction<Medicine[]>>;
  isDoctor: boolean;
  patientId: string;
  setPatientData: React.Dispatch<React.SetStateAction<PatientDataSchema>>;
  setDoctorNotes: React.Dispatch<React.SetStateAction<string>>;
}

export default function TableExample(props: Props) {
  const {
    medicine,
    setMedicine,
    isDoctor,
    patientId,
    setPatientData,
    setDoctorNotes,
  } = props;
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [medicineName, setMedicineName] = React.useState("");
  const [medicineDosage, setMedicineDosage] = React.useState("");
  const [medicineSelected, setMedicineSelected] =
    React.useState<boolean>(false);
  let currSelectedId =
    Array.from(selectedKeys).length > 0 ? Array.from(selectedKeys)[0] : "";
  const [currSelectedMedicine, setCurrSelectedMedicine] =
    React.useState<Medicine>({
      id: "",
      medicine: "",
      dosage: "",
      doctor: "",
      status: "taken",
      doctorId: "",
    });
  useEffect(() => {
    if (currSelectedId !== "") {
      setCurrSelectedMedicine(
        medicine.filter((medicine) => medicine.id === currSelectedId)[0],
      );
    }
  }, [currSelectedId]);

  useEffect(() => {
    if (Array.from(selectedKeys).length !== 0) {
      setMedicineSelected(true);
    } else {
      setMedicineSelected(false);
    }
  }, [selectedKeys]);

  const [doctorId, setDoctorId] = React.useState("");
  useEffect(() => {
    if(isDoctor) {
      const getDoctorId = async () => {
        try {
          const res = await axios.post(`${BACKEND_URI}/auth/getUserData`, {});
          setDoctorId(res.data.data.doctorId);
        } catch (error) {
          console.log(error);
        }
      };
      getDoctorId();
    }
  }, []);

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...medicine];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.medicine.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    if (sortDescriptor) {
      const { column, direction } = sortDescriptor;

      filteredUsers.sort((a, b) => {
        const aValue = a[column as keyof Medicine]?.toString().toLowerCase();
        const bValue = b[column as keyof Medicine]?.toString().toLowerCase();

        if (aValue < bValue) return direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filteredUsers;
  }, [medicine, filterValue, statusFilter, sortDescriptor]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback(
    (user: Medicine, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof Medicine];

      switch (columnKey) {
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex w-4 items-center justify-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>View</DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {medicineSelected ? (
              <Button
                variant="flat"
                color={
                  !isDoctor && medicineSelected
                    ? currSelectedMedicine?.status === "taken"
                      ? "success"
                      : "danger"
                    : "danger"
                }
                onPress={async () => {
                  // hit api to update medicine status
                  if (!isDoctor) {
                    await axios.post(
                      `${BACKEND_URI}/patient/toggleMedicineStatus`,
                      {
                        medicineId: currSelectedMedicine?.id,
                        status:
                          currSelectedMedicine?.status === "taken"
                            ? "pending"
                            : "taken",
                      },
                    );
                  } else {
                    if(doctorId !== currSelectedMedicine?.doctorId){
                      ToastErrors("You are not authorized to remove this medicine");
                      return;
                    }
                    await axios.post(`${BACKEND_URI}/doctor/removeMedicine`, {
                      medicineId: currSelectedMedicine?.id,
                      patientId: patientId,
                    });
                    getPatientMedical(
                      patientId,
                      setPatientData,
                      setDoctorNotes,
                      setMedicine,
                    );
                  }
                  const getMedicines = async () => {
                    try {
                      const medicineRes = await axios.post(
                        `${BACKEND_URI}/patient/getMedicines`,
                        {},
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
                    } catch (error) {
                      console.log(error);
                    }
                  };
                  getMedicines();
                  setMedicineSelected(false);
                  setCurrSelectedMedicine({
                    id: "",
                    medicine: "",
                    dosage: "",
                    doctor: "",
                    status: "taken",
                    doctorId: "",
                  });
                  setSelectedKeys(new Set([]));
                }}
              >
                {!isDoctor && medicineSelected
                  ? currSelectedMedicine?.status === "taken"
                    ? "Mark as Pending"
                    : "Mark as Taken"
                  : ""}
                {isDoctor && "Remove Medicine"}
              </Button>
            ) : (
              <></>
            )}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => setVisibleColumns(new Set(keys))}
              >
                {columns
                  .filter((column) => column.name !== "") // Filter out columns with empty names
                  .map((column) => (
                    <DropdownItem
                      key={String(column.uid)}
                      className="capitalize"
                    >
                      {capitalize(column.name)}
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>

            {isDoctor && (
              <Popover placement="bottom" showArrow offset={10}>
                <PopoverTrigger>
                  <Button color="primary" endContent={<PlusIcon />}>Add New</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px]">
                  {(titleProps) => (
                    <div className="w-full px-1 py-2">
                      <p
                        className="text-small font-bold text-foreground"
                        {...titleProps}
                      >
                        Medicine
                      </p>
                      <div className="mt-2 flex w-full flex-col gap-2">
                        <Input
                          placeholder="Eg: Aspirin"
                          label="Medicine Name"
                          size="sm"
                          variant="bordered"
                          onChange={(e) => {
                            setMedicineName(e.target.value);
                          }}
                          value={medicineName}
                        />
                        <Input
                          placeholder="Eg: 100mg Morning"
                          label="Dosage"
                          size="sm"
                          variant="bordered"
                          onChange={(e) => setMedicineDosage(e.target.value)}
                          value={medicineDosage}
                        />
                        <Button color="success" size="sm" endContent={<PlusIcon />} variant="flat"
                          onClick={async () => {
                            await axios.post(`${BACKEND_URI}/doctor/addMedicine`, {
                              patientId: patientId,
                              medicine: medicineName,
                              dosage: medicineDosage,
                            })
                            getPatientMedical(patientId, setPatientData, setDoctorNotes, setMedicine);
                            setMedicineName("");
                            setMedicineDosage("");
                          }}
                        >
                          Add Medicine
                        </Button>
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    medicine.length,
    hasSearchFilter,
    medicineSelected,
    currSelectedMedicine,
    medicineName, 
    medicineDosage,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        color={
          !isDoctor && medicineSelected
            ? currSelectedMedicine?.status === "taken"
              ? "success"
              : "danger"
            : "danger"
        }
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "overflow-y-scroll",
        }}
        className="max-h-[80vh]"
        selectedKeys={selectedKeys}
        selectionMode="single"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={filteredItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
