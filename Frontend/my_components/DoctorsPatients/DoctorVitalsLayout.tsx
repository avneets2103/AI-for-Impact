import { GraphSchema } from "@/Interfaces";
import { cn } from "@/lib/utils";
import LineChart from "@/my_components/Charts/charts";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";

export const DoctorVitalsLayout = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid gap-3 md:auto-rows-[12rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const DoctorVitalsLayoutItem = ({
  id,
  name,
  data,
  description,
}: GraphSchema) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [labels, setLabels] = useState<string[]>([]); // X-axis dates
  const [Data, setData] = useState<number[]>([]); // Y-axis parameter values
  useEffect(() => {
    const newData = [];
    const newLabels = [];
    for (let i = 0; i < data.length; i++) {
      newData.push(data[i].value);
      newLabels.push(data[i].date);
    }
    setData(newData);
    setLabels(newLabels);
  }, [data]);

  return (
    <div
      key={id}
      className={cn(
        "group/bento row-span-1 flex w-full cursor-pointer flex-col justify-between space-y-4 overflow-clip rounded-xl border border-2 border-gray-400 border-transparent bg-[--fixed-bg-color] p-[0.1px]",
      )}
    >
      <div className="relative h-full w-full rounded-xl" onClick={onOpen}>
        <div className="-z-5 absolute flex h-full w-full rounded-xl bg-textColorDark opacity-10"></div>
        <div className="z-5 absolute flex h-full w-full">
          <LineChart
            labels={labels}
            data={Data}
            xtitle="Date"
            ytitle={""}
            name={name}
            xlabelOn={false}
          />
        </div>
      </div>
      <Modal
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center" // where to place the modal
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex items-center gap-4 flex-col">
                  <div className="flex items-center gap-0 flex-col">
                    <p className="text-xl text-textColorDark">{name}</p>
                    <p className="text-sm text-textColorLight">{description}</p>
                  </div>
                  <LineChart
                    labels={labels}
                    data={Data}
                    xtitle="Date"
                    ytitle={""}
                    name={name}
                    xlabelOn={true}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-2">
                  <Button
                    className="mx-auto text-primaryColor"
                    variant="flat"
                  >
                    Remove Chart
                  </Button>
                  <Button
                    className="bg-primaryColor text-white"
                    variant="flat"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
