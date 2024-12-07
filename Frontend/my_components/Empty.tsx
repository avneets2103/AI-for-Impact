import React from 'react'

interface Props {
    text1: string;
    text2: React.ReactNode;
}

function Empty(props: Props) {
    const {text1, text2} = props

    return (
        <div className='flex flex-col h-full w-full items-center justify-center gap-2 mb-10'>
            <h1 className='text-3xl font-bold'>{text1}</h1>
            <p className='text-lg'>{text2}</p>
        </div>
    )
}

export default Empty
