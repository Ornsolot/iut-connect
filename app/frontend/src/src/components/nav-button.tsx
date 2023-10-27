import React from 'react'
import { useRouter, usePathname } from 'next/navigation';
import { Button } from './ui/button';

export default function NavButton({ link, open }: { link: any, open: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Button
      onClick={() => router.push(link.path)}
      variant={pathname === link.path ? 'default' : 'ghost'}
      className={`font-kodchasan font-bold w-[calc(100%-2rem)] gap-2 mx-auto my-1 p-3 justify-start data-[open=false]:w-[40px] data-[open=false]:h-[40px] data-[open=false]:p-1 data-[open=false]:justify-center transition-[height,width] duration-300 ease-in-out ${ pathname === link.path ? 'text-white' : 'text-gray-500' }`}
      data-open={open}>
      { link.icon }
      { open && link.name }
    </Button>
  )
}
