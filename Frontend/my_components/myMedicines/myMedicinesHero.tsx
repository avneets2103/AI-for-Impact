import { Medicine } from '@/Interfaces'
import TableExample from '@/my_components/Table/table'
import { Tab } from '@nextui-org/react'
import React from 'react'

interface Props {
    medicine: Medicine[],
    setMedicine: React.Dispatch<React.SetStateAction<Medicine[]>>
}

function MyMedicinesHero(props: Props) {
    const {medicine, setMedicine} = props
    return (
        <TableExample medicine={medicine} setMedicine={setMedicine}/>
    )
}

export default MyMedicinesHero
