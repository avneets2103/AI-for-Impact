import { ReportsSchema } from "@/Interfaces";
import { ReportLayout, ReportLayoutItem } from "@/my_components/myReports/ReportLayout";
import React from "react";
import { MyPatientReportLayout, MyPatientReportLayoutItem } from "./myPatientsReportsLayout";

interface Props {
  data: ReportsSchema[];
}

function MyPatientReportHero(props: Props) {
  const {data} = props;
  return (
    <MyPatientReportLayout className="w-full">
      {data.map(
        ({
          id,
          reportName,
          reportDate,
          location,
          reportPDFLink,
          reportSummary
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
    </MyPatientReportLayout>
  );
}

export default MyPatientReportHero;
