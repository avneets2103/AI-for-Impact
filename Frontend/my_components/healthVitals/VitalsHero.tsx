import { GraphSchema } from "@/Interfaces";
import React from "react";
import { VitalsLayout, VitalsLayoutItem } from "./VitalsLayout";
import Empty from "../Empty";

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
  if(filteredData.length === 0){
    return <Empty text1="No Charts Added!" text2={
    <div className='flex items-center justify-center gap-2'>
      <p>Click on the </p> <div className='bg-secondaryColor p-2 rounded-full'><img src="/icons/aiGenerated.png" alt="logo" className="w-[15px]" /></div> <p> button to add a new chart</p>
    </div>
    }/>
  }
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
