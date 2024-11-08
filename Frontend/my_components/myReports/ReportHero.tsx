import { ReportsSchema } from "@/Interfaces";
import { ReportLayout, ReportLayoutItem } from "@/my_components/myReports/ReportLayout";
import React from "react";

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
