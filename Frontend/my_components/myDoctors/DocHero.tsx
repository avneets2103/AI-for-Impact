import React from 'react'
import { DocLayout, DocLayoutItem } from './DocLayout';
import { DocSchema } from '@/Interfaces';
import Empty from '../Empty';

interface Props {
    data: DocSchema[];
    searchDoc: string;
    setDocList: React.Dispatch<React.SetStateAction<DocSchema[]>>
}

function DocHero({data, searchDoc, setDocList}: Props) {
  
    const filteredData = data.filter((doc: DocSchema) => {
      const lowerCaseSearchDoc = searchDoc.toLowerCase();
      return (
        doc.name.toLowerCase().includes(lowerCaseSearchDoc) ||
        doc.speciality.toLowerCase().includes(lowerCaseSearchDoc) ||
        doc.qualifications.toLowerCase().includes(lowerCaseSearchDoc) ||
        doc.experience.toLowerCase().includes(lowerCaseSearchDoc)
      );
    });
  
    if(filteredData.length === 0){
      return <Empty text1="No Doctors Added!" text2={
      <div className='flex items-center justify-center gap-2'>
        <p>Click on the </p> <div className='bg-secondaryColor p-2 rounded-full'><img src="/icons/additionH.png" alt="logo" className="w-[15px]" /></div> <p> button to add a new doctor</p>
      </div>
      }/>
    }
    return (
      <DocLayout className='w-full h-full max-h-[82vh] overflow-y-scroll'> 
        {filteredData.map((doc) => (
          <DocLayoutItem
            key={doc.id}
            id={doc.id}
            name={doc.name}
            speciality={doc.speciality}
            img={doc.imageLink}
            qualification={doc.qualifications}
            experience={doc.experience}
            hospitalNumber={doc.hospitalNumber}
            setDocList={setDocList}
          />
        ))}
      </DocLayout>
    );
  }

export default DocHero
