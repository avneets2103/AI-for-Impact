import { ReportsSchema } from "@/Interfaces";
import { ReportLayout, ReportLayoutItem } from "@/my_components/myReports/ReportLayout";
import React from "react";
import Empty from "../Empty";

interface Props {
  data: ReportsSchema[];
  reportSearch: string;
}

function ReportHero(props: Props) {
  const {reportSearch, data} = props;
  const filteredData = data.filter((doc: ReportsSchema) => {
    const lowerCaseSearchDoc = reportSearch.toLowerCase();
    return (
      doc.reportName.toLowerCase().includes(lowerCaseSearchDoc) ||
      doc.location.toLowerCase().includes(lowerCaseSearchDoc)
    );
  });
  if(filteredData.length === 0){
    return <Empty text1="No Reports Added!" text2={
    <div className='flex items-center justify-center gap-2'>
      <p>Click on the </p> <div className='bg-secondaryColor p-2 rounded-full'><img src="/icons/additionH.png" alt="logo" className="w-[15px]" /></div> <p> button to add a new report</p>
    </div>
    }/>
  }
  return (
    <ReportLayout className="w-full max-h-[82vh] overflow-y-scroll">
      {filteredData.map(
        ({
          id,
          reportName,
          reportDate,
          location,
          reportPDFLink,
          reportSummary
        }) => (
          <ReportLayoutItem
            key={id}
            id={id}
            reportName={reportName}
            reportDate={reportDate}
            location={location}
            reportPDFLink={reportPDFLink}
            reportSummary={reportSummary}
          />
        ),
      )}
    </ReportLayout>
  );
}

export default ReportHero;
