"use client"
import { PatientSchema } from "@/Interfaces";
import React from "react";
import DocViewLayout from "./DocViewLayout";
import DocViewLayoutItem from "./DocViewLayoutItem";
import Empty from "../Empty";

interface Props {
  data: PatientSchema[];
  searchPat: string;
  setPatList: React.Dispatch<React.SetStateAction<Array<PatientSchema>>>
}

function DocViewHero({ data, searchPat, setPatList }: Props) {
  const filteredData = data.filter((doc: PatientSchema) => {
    const lowerCaseSearchDoc = searchPat.toLowerCase();
    return (
      doc.name.toLowerCase().includes(lowerCaseSearchDoc) ||
      doc.sex.toLowerCase().includes(lowerCaseSearchDoc) ||
      doc.bloodGroup.toLowerCase().includes(lowerCaseSearchDoc)
    );
  });
  if(filteredData.length === 0){
    return <Empty text1="No Patients Added!" text2={
    <div className='flex items-center justify-center gap-2'>
      <p>Click on the </p> <div className='bg-secondaryColor p-2 rounded-full'><img src="/icons/additionH.png" alt="logo" className="w-[15px]" /></div> <p> button to add a new patient</p>
    </div>
    }/>
  }
  return (
    <DocViewLayout className="w-full">
      {filteredData.map(
        ({
          id,
          name,
          sex,
          age,
          imageLink,
          bloodGroup,
          absoluteSummary
        }) => (
          <DocViewLayoutItem
            key={id}
            id={id}
            name={name}
            sex={sex}
            age={age}
            img={imageLink}
            absoluteSummary = {absoluteSummary}
            bloodGroup={bloodGroup}
            setPatList={setPatList}
          />
        )
      )}
    </DocViewLayout>
  );
}

export default DocViewHero;
