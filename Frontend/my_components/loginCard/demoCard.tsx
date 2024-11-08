import { Button } from '@nextui-org/react'
import React from 'react'

function DemoCard() {
    return (
        <div className='hide-on-mobile ml-12 gap-8 flex flex-col justify-between w-1/4'>
            <div>
                <div
                className='
                text-4xl
                text-textColorDark
                georama-b
                '
                >
                    <p>Making</p> 
                    <p className='text-nowrap'>diagnosis better</p> 
                    <p>and faster!</p>
                </div>
                <p className='text-xs text-textColorDark'>We help you get medical care in the best and most efficient way possible!</p>
            </div>
            <div>
                <p className='text-xs text-textColorDark'>Wanna know more?</p>
                <Button 
                color="default" 
                variant="bordered"
                radius="md"
                size="sm"
                >Read</Button> 
            </div>
        </div>
    )
}

export default DemoCard
