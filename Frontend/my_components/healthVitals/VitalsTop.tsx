import React, { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import SectionDisplay from "../sectionDisplay/sectionDisplay";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "@/utils/axios";
import { BACKEND_URI } from "@/CONSTANTS";
import { ToastErrors, ToastInfo } from "@/Helpers/toastError";
import { CircularProgress } from "@nextui-org/react";
import Image from "next/image";
import { GraphSchema } from "@/Interfaces";
import LineChart from "@/my_components/Charts/charts";
import { PatientData } from "@/Data/PatientData";

interface Props {
  searchVitals: string;
  setSearchVitals: React.Dispatch<React.SetStateAction<string>>;
}

function VitalsTop(props: Props) {
  const [chartGenerated, setChartGenerated] = useState(false);
  const [newChart, setNewChart] = useState<GraphSchema>({
    id: "",
    name: "",
    data: [],
    description: "",
    sourceList: [],
    unit: "",
    queryText: "",
  });
  const { searchVitals, setSearchVitals } = props;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const placeholders = [
    "Prompt what you want to make?",
    "My Insulin dosage since the past 5 years?",
    "My protein levels in the past 3 months?",
    "Blood pressure in the past 10 reports?",
  ];
  const [labels, setLabels] = useState<string[]>([]); // X-axis dates
  const [Data, setData] = useState<number[]>([]); // Y-axis parameter values
  useEffect(() => {
    const newData = [];
    const newLabels = [];
    for (let i = 0; i < newChart.data.length; i++) {
      newData.push(Number(newChart.data[i].value));
      newLabels.push(newChart.data[i].date);
    }
    setData(newData);
    setLabels(newLabels);
  }, [newChart]);

  return (
    <div className="width-[100%] my-4 flex h-[7%] cursor-pointer items-center justify-between font-medium">
      <div className="flex gap-4">
        <SectionDisplay />
      </div>
      <div className="flex h-[7vh] items-end gap-2">
        <Input
          radius="sm"
          placeholder="Search Graph"
          startContent={
            <div>
              <Image
                width={100}
                height={100}
                src="/icons/search.png"
                className="w-[15px]"
                alt="logo"
              />
            </div>
          }
          value={searchVitals}
          onChange={(e) => setSearchVitals(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondaryColor"
            onClick={() => {
              onOpen();
            }}
          >
            <Image
              width={100}
              height={100}
              src="/icons/aiGenerated.png"
              className="w-[15px]"
              alt="logo"
            />
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          onOpenChange={() => {
            onOpenChange();
            setPrompt("");
            setNewChart({
              name: "",
              id: "",
              description: "",
              data: [],
              sourceList: [],
              unit: "",
              queryText: "",
            });
            setChartGenerated(false);
          }}
          placement="top-center"
          size="4xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col items-center justify-center gap-1 font-medium">
                  <p className="flex items-center gap-1 text-lg font-semibold">
                    <img
                      src="/icons/aiGenerated.png"
                      alt=""
                      className="h-[20px] w-[20px]"
                    />
                    Make a New Chart
                  </p>
                </ModalHeader>
                <ModalBody>
                  {(loading && (
                    <div className="flex h-full w-full items-center justify-center">
                      <CircularProgress
                        aria-label="Loading..."
                        color="danger"
                      />
                    </div>
                  )) || (
                    <>
                      <div className="flex flex-col gap-5">
                        <PlaceholdersAndVanishInput
                          placeholders={placeholders}
                          onChange={(e) => setPrompt(e.target.value)}
                          onSubmit={async () => {
                            try {
                              setLoading(true);
                              const response = await axios.post(
                                `${BACKEND_URI}/patient/queryDateVal`,
                                {
                                  queryText: prompt,
                                },
                              );
                              let nD = [];
                              const dat = response.data.data.list;
                              for (let i = 0; i < dat.length; i++) {
                                const val = dat[i].value;
                                let st = "";
                                for (let j = 0; j < val.length; j++) {
                                  if(val[j] === " "){break;}
                                  st += val[j];
                                }
                                nD.push({
                                  date: dat[i].date,
                                  value: Number(st),
                                });
                              }
                              setNewChart({
                                name: response.data.data.title,
                                id: response.data.data.id,
                                description: response.data.data.description,
                                data: nD,
                                sourceList: response.data.data.sourceList,
                                unit: response.data.data.unit,
                                queryText: prompt,
                              });
                              setChartGenerated(true);
                            } catch (e) {
                              ToastErrors("Add Report Failed");
                            } finally {
                              setLoading(false);
                            }
                          }}
                        />
                      </div>
                      {chartGenerated && (
                        <div className="flex h-[40vh] gap-2">
                          <LineChart
                            labels={labels}
                            data={Data}
                            xtitle="Date"
                            ytitle={""}
                            name={newChart.name}
                            xlabelOn={false}
                          />
                          <div className="max-h-[40vh] w-[20%] overflow-y-auto">
                            <p className="text-sm font-normal">
                              <span className="text-sm font-normal text-textColorLight">
                                Prompt:{" "}
                              </span>
                              {prompt}
                            </p>
                            <p className="text-lg font-semibold">
                              <span className="text-sm font-normal text-textColorLight">
                                Name:{" "}
                              </span>
                              {newChart.name}
                            </p>

                            <p className="text-sm font-normal">
                              <span className="text-sm font-normal text-textColorLight">
                                Unit:{" "}
                              </span>
                              {newChart.unit}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <div className="flex gap-2">
                    {chartGenerated && (
                      <>
                      <Button
                      color="primary"
                      variant="flat"
                      onPress={async () => {
                        try {
                          setLoading(true);
                          const response = await axios.post(
                            `${BACKEND_URI}/patient/queryDateVal`,
                            {
                              queryText: prompt,
                            },
                          );
                          let nD = [];
                          const dat = response.data.data.list;
                          for (let i = 0; i < dat.length; i++) {
                            const val = dat[i].value;
                            let st = "";
                            for (let j = 0; j < val.length; j++) {
                              if(val[j] === " "){break;}
                              st += val[j];
                            }
                            nD.push({
                              date: dat[i].date,
                              value: Number(st),
                            });
                          }
                          setNewChart({
                            name: response.data.data.title,
                            id: response.data.data.id,
                            description: response.data.data.description,
                            data: nD,
                            sourceList: response.data.data.sourceList,
                            unit: response.data.data.unit,
                            queryText: prompt,
                          });
                          setChartGenerated(true);
                        } catch (e) {
                          ToastErrors("Add Report Failed");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      {chartGenerated ? "Regenerate" : "Generate"} ✨
                    </Button>
                      <Button
                        className="mx-auto bg-primaryColor text-white"
                        variant="flat"
                        onPress={async () => {
                          try {
                            setLoading(true);
                            const response = await axios.post(
                              `${BACKEND_URI}/patient/acceptChart`,
                              {
                                patientId: "",
                                chartName: newChart.name,
                                data: newChart.data,
                                queryText: newChart.queryText,
                                description: newChart.description,
                                sourceList: newChart.sourceList,
                                unit: newChart.unit
                              },
                            );
                            setChartGenerated(false);
                            setPrompt("");
                            ToastInfo("Chart Added Successfully");
                          } catch (e) {
                            ToastErrors("Add Report Failed");
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        Save
                      </Button>
                      </>
                    )}
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default VitalsTop;
