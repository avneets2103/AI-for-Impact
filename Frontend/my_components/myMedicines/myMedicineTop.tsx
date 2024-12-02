import React from 'react'
import SectionDisplay from '../sectionDisplay/sectionDisplay'

function MyMedicineTop() {
    return (
        <div className="width-[100%] my-4 flex h-[7%] cursor-pointer place-items-end justify-between font-medium">
            <div className="flex gap-4">
                <SectionDisplay />
            </div>
            <div className='text-xl font-light'>{new Date().toDateString()}</div>
        </div>
    )
}

export default MyMedicineTop
