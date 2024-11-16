import { GraphSchema } from "@/Interfaces";
import React from "react";
import { VitalsLayout, VitalsLayoutItem } from "./VitalsLayout";

interface Props {
  data: GraphSchema[];
  searchVitals: string;
  setHealthGraphs: React.Dispatch<React.SetStateAction<GraphSchema[]>>
}

function VitalsHero({ data, searchVitals, setHealthGraphs }: Props) {
  const filteredData = data.filter((doc: GraphSchema) => {
    const lowerCaseSearchDoc = searchVitals.toLowerCase();
    return (
      doc?.name?.toLowerCase().includes(lowerCaseSearchDoc)
    );
  });
  return (
    <VitalsLayout className="w-full max-h-[82vh] overflow-y-scroll">
      {filteredData.map(
        ({
          id, name, data, description, unit, sourceList, queryText
        }) => (
          <VitalsLayoutItem
            key={id}
            id={id}
            name={name}
            data={data}
            description={description}
            unit={unit}
            sourceList={sourceList}
            queryText={queryText}
            setHealthGraphs={setHealthGraphs}
          />
        ),
      )}
    </VitalsLayout>
  );
}

export default VitalsHero;
