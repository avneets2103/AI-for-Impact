import { cn } from "@/lib/utils";
import Image from "next/image";

export const MyPatientReportLayout = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid gap-4 md:auto-rows-[14rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};


export const MyPatientReportLayoutItem = ({
  id,
  reportName,
  reportDate,
  location,
  reportPDFLink,
}: {
  id: string;
  reportName: string;
  reportDate: string;
  location: string;
  reportPDFLink: string;
}) => {

return (
    <div
        className={cn(
            "group/bento w-[21vw] row-span-1 flex cursor-pointer flex-col justify-between space-y-4 overflow-clip rounded-xl border border-transparent bg-[--fixed-bg-color] p-0",
        )}
        onClick={() => window.open(reportPDFLink, '_blank')}
    >
      <div className="w-full h-full relative">
        <Image width={100} height={100} src={"/images/rep1.png"} alt="report" className="h-full w-full -z-5 absolute"/>
        <div className="h-full w-full bg-black opacity-20 -z-5 absolute flex"></div>
        <div className="h-full w-full z-0 absolute flex justify-between flex-col p-3 text-[whitesmoke]">
          <p className="text-lg font-medium">{reportName.slice(0, Math.min(reportName.length, 25))}</p>
          <div>
            <p>{reportDate.slice(0, Math.min(reportDate.length, 25))}</p>
            <p>{location.slice(0, Math.min(location.length, 25))}</p>
          </div>
        </div>
      </div>
    </div>
);
};
