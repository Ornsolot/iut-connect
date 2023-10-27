'use client'

import React from 'react'
import ParcoursCircle from './circle'

export default function ParcoursLine({ events, onClick }: { events: any[], onClick?: (id:number) => void }) {
  const circleSize = 10
  const circleInnerSize = 7

  return (
    <div className={`relative z-0 flex flex-col items-center justify-center`} style={{padding: `${(circleSize - circleInnerSize) / 2}rem`, gap: `${(circleSize - circleInnerSize) / 2}rem`}}>
        {
          events?.length > 0 &&
          <div className='absolute top-0 left-0 w-[50%]'
            style={{
              height: `${(circleSize - circleInnerSize) / 2}rem`,
              backgroundColor: events[0]?.color
              }}>
          </div>
        }
        {
          events?.map((event, index) => (
            <ParcoursCircle event={event} current={events.findIndex(e => !e.is_validated) === index} invert={index % 2 === 0} size={circleSize} circleInnerSize={circleInnerSize} onClick={onClick} key={index} >
              {index}
            </ ParcoursCircle>
          ))
        }
        {
          events?.length > 0 &&
          <div className='absolute bottom-0 w-[50%]'
            style={{
              height: `${(circleSize - circleInnerSize) / 2}rem`,
              left: `${(events.length % 2 === 0) ? 50 : 0}%`,
              backgroundColor:
                events[events.length - 1]?.is_validated ?
                events[events.length - 1]?.color :
                '#808080'
              }}>
          </div>
        }
    </div>
  )
}
