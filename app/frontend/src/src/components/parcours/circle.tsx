'use client'

import React, { useState } from 'react'
import './circle.css'
import dynamic from 'next/dynamic'
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function ParcoursCircle({ children, event, current, invert, size=6, circleInnerSize=4, className, style, onClick }: { children?: React.ReactNode, event: { id: number, name: string, description: string, color: string, icon: string, is_validated: boolean, deadline: Date }, current?: boolean, invert?: boolean, size?: number, circleInnerSize?: number, className?: string, style?: React.CSSProperties, onClick?: (id: number) => void }) {
    const color = colorData(event.color);
    const disabledColor = colorData('#808080');
    const [open, setOpen] = useState(false);

    const LucideIcon = dynamic(dynamicIconImports[(event.icon || 'clipboard-list') as keyof typeof dynamicIconImports], { ssr: false });

    const baseStyle = {
        ...style,
        width: `${size}rem`,
        height: `${size}rem`,
        margin: `-${(size - circleInnerSize) / 2}rem`,
        '--color': (event.is_validated || current ? color.hex : disabledColor.hex),
    }

    const enabledBackground = {...baseStyle, background: color.rgba(0.2)};
    const disabledBackground = {...baseStyle, background: disabledColor.rgba(0.2)};

    const innerBaseStyle = {
        width: `${circleInnerSize}rem`,
        height: `${circleInnerSize}rem`,
        ...(current && {color: color.hex}),
    }

    function hexToRGB(hex:string) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return {r, g, b};
    }

    function colorData(hex: string) {
        const rgb = hexToRGB(hex);
        return {
            hex,
            rgb: `rbg(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            ...rgb,
            rgba: (a:number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`,
        };
    }

    function getColor() {
        return (event.is_validated || current ? color.hex : disabledColor.hex);
    }

    return (
    <div className={`relative circle ${current && 'current'} rounded-full flex items-center justify-center ${invert && 'after:-scale-x-100'} ${className}`} style={event.is_validated || current ? enabledBackground : disabledBackground}>
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger>
                <div className={`relative shadow-2xl z-50 rounded-full flex items-center justify-center cursor-pointer bg-background ${event.is_validated || current ? '' : 'text-gray-500'}`} style={innerBaseStyle}>
                    <span className={`font-black text-4xl`}>{children}</span>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='relative h-16 flex flex-col gap-1 justify-center items-center'>
                        <div className='absolute flex items-center justify-center -top-3 -left-3 rounded-full w-12 h-12' style={{backgroundColor: getColor()}}>
                            <div className='flex items-center justify-center rounded-full w-8 h-8 bg-background'>
                                <span className={`font-black text-2xl`}>{children}</span>
                            </div>
                        </div>
                        <div className='flex gap-3 items-center justify-center'>
                            <LucideIcon className={`w-7 h-7 p-1 rounded-md text-background` } style={{backgroundColor: getColor()}} />
                            {event.name}
                        </div>
                        <p className='font-bold' style={new Date(event.deadline) < new Date() ? {color: 'red'} : {}}>{format(new Date(event.deadline), "dd/MM/yyyy")}</p>
                    </DialogTitle>
                    <DialogDescription className='flex flex-col'>
                        {event.description}
                        <Button type='submit' className='mt-2' onClick={() => { if (onClick) onClick(event.id); setOpen(false); }} disabled={!current && !event.is_validated}>{!event.is_validated ? 'Valider' : 'Dévalider'}</Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
        <div className={`absolute w-60 top-2 ${invert ? `pr-[1.5rem] text-right` : `pl-[1.5rem]`} gap-2 whitespace-nowrap border-b-2 ${!event.is_validated  && !current && 'text-gray-500'}`} style={{borderBlockColor: getColor(), ...(invert ? {left : `${size / 2}rem`, paddingLeft: `${size / 2}rem`} : {right: `${size / 2}rem`, paddingRight: `${size / 2}rem`})}}>
            {event.name}
            <LucideIcon className={`absolute ${invert ? `left-[calc(100%-1rem)]` : `right-[calc(100%-1rem)]`} bottom-[-1.5px] rounded-full w-7 h-7 p-1 text-background` } style={{backgroundColor: getColor()}} />
        </div>
        <div className={`absolute h-full w-[17rem] -z-[1] top-0 ${invert ? `left-[50%]` : `right-[50%]`} rounded-md ${current && 'border-r-[8px]'}`} style={(current ? {background: color.rgba(0.2), borderRightColor: color.hex} : {})}>
            <div className={`absolute flex flex-col justify-between top-9 w-60 ${invert ? `left-[1.5rem] pl-[4rem] pr-[1.5rem]` : `right-[1.5rem] pr-[4rem] pl-[1.5rem] text-right`} gap-2 text-sm overflow-hidden ${!event.is_validated  && !current && 'text-gray-500'}`} style={{height: `${circleInnerSize+0.5}rem`}}>
                <p>{event.description}</p>
                <p className='font-bold' style={new Date(event.deadline) < new Date() ? {color: 'red'} : {}}>{format(new Date(event.deadline), "dd/MM/yyyy")}</p>
            </div>
        </div>
      </div>
    )
}
