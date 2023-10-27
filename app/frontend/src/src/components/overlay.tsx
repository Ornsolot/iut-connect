'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Archive, Bell, Book, Briefcase, CalendarRange, ChevronLeft, CreditCard, Keyboard, LayoutDashboard, LogOut, Milestone, PersonStanding, Ruler, Settings, User, User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavButton from '@/components/nav-button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import UserIcon from '@/components/user-icon';
import { ModeToggle } from '@/components/theme-toggler';
import IutConnectLogo from './iutconnect-logo';

export default function Overlay({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { api, user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(localStorage.getItem("sidebar_open") ? (localStorage.getItem("sidebar_open") === 'true' ? true : false) : true);

  const links: {
    student: {name: string, path: string, icon: React.JSX.Element}[],
    tutor: {name: string, path: string, icon: React.JSX.Element}[],
    employee: {name: string, path: string, icon: React.JSX.Element}[]
    admin: {name: string, path: string, icon: React.JSX.Element}[]
  } = {
    student : [
      { name: 'Parcours', path: '/s', icon: <Milestone size={18} /> },
      { name: 'Offres', path: '/s/offers', icon: <Briefcase size={18} /> },
      { name: 'Archives', path: '/s/archives', icon: <Archive size={18} /> },
      { name: 'Planning', path: '/s/planning', icon: <CalendarRange size={18} /> },
    ],
    tutor : [
      { name: 'Parcours', path: '/t', icon: <Milestone size={18} /> },
      { name: 'Étudiants', path: '/t/students', icon: <Book size={18} /> },
      { name: 'Planning', path: '/t/planning', icon: <CalendarRange size={18} /> },
    ],
    employee : [
      { name: 'Offres', path: '/e/offres', icon: <LayoutDashboard /> },
      { name: 'Rédiger', path: '/e/redaction', icon: <LayoutDashboard /> },
    ],
    admin : [
      { name: 'Tableau de bord', path: '/t/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    ]
  }

  useEffect(() => {
    localStorage.setItem("sidebar_open", `${open}`)
  }, [open])

  function getPrefixRoute(): string {
    if (isAuthenticated()) {
      if (user.role === 'student') {
        return '/s'
      } else if (user.role === 'tutor') {
        return '/t'
      } else if (user.role === 'employee') {
        return '/e'
      }
    }
    return '/'
  }

  function handleLogout() {
    logout();
  };

  function isCoarsePointer() {
    return window.matchMedia && window.matchMedia('(pointer: coarse)').matches
  }
  
  if (pathname.split('/').filter(Boolean)[0] !== "auth") {
    if (isCoarsePointer()) {
      return (
        <div className='relative w-full h-screen'>
          <div className='w-full h-full overflow-auto'>
            {children}
          </div>
          {
            isAuthenticated() && (
              <>
                <nav className='fixed bottom-0 dark:bg-neutral-900 bg-gray-50 shadow-[1px_0px_25px_0px_rgba(0,0,0,0.1)] rounded-t-lg w-full h-10 flex justify-around'>
                  { user.role === 'student' && links.student.map((link) => <NavButton link={link} open={false} key={link.name} />)}
                  { user.role === 'tutor' && links.tutor.map((link) => <NavButton link={link} open={false} key={link.name} />)}
                  { user.role === 'tutor' && user.is_admin && links.admin.map((link) => <NavButton link={link} open={false} key={link.name} />)}
                  { user.role === 'employee' && links.employee.map((link) => <NavButton link={link} open={false} key={link.name} />)}
                  {/* <ModeToggle open={open} /> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className='flex gap-2 font-black text-md'>
                        <UserIcon user={user} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(100vw-2rem)] mr-4 mb-2">
                      <DropdownMenuLabel>{user.mail}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem className='py-0'>
                          <Button variant="link" className='w-full h-fit p-0 py-1 justify-start' onClick={() => router.push(`${getPrefixRoute()}/profile`)}><User className="mr-2 h-4 w-4" />Profile</Button>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className='py-0'>
                          <Button variant="link" className='w-full h-fit p-0 py-1 justify-start' onClick={() => router.push('/s')}><Settings className="mr-2 h-4 w-4" />Settings</Button>
                        </DropdownMenuItem> */}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem className='py-0'>
                          <Button variant="link" className='w-full h-fit p-0 py-1 justify-start' onClick={() => router.push('/terms-and-privacy')}><Book className="mr-2 h-4 w-4" />Terms an privacy</Button>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem className='py-0'>
                          <Button variant="link" className='w-full h-fit p-0 py-1 justify-start' onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              </>
            )
          }
        </div>
      )
    } else {      
      return (
        <div className="grid grid-cols-[11rem,auto] data-[open=false]:grid-cols-[4rem,auto] transition-[grid-template-columns] duration-300 ease-in-out grid-rows-[2.5rem,auto] w-full h-screen" data-open={open}>
          <div className="dark:bg-neutral-900 bg-gray-50 shadow-[1px_0px_25px_0px_rgba(0,0,0,0.1)] col-start-1 row-start-1 col-span-2 row-span-1">
            <div className='flex ml-auto w-fit items-center'>
              {
                isAuthenticated() &&
                <>
                  {/* <Button variant="ghost" className="h-fit w-fit p-0"><Bell className='h-6 w-6' /></Button> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className='flex gap-2 font-black text-md'>
                        {user.name} {user.first_name && user.first_name}
                        <UserIcon user={user} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>{user.mail}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem className='py-0'>
                          <Button variant="link" className='w-full h-fit p-0 py-1 justify-start' onClick={() => router.push(`${getPrefixRoute()}/profile`)}><User className="mr-2 h-4 w-4" />Profile</Button>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className='py-0'>
                          <Button variant="link" className='w-full h-fit p-0 py-1 justify-start' onClick={() => router.push('/s')}><Settings className="mr-2 h-4 w-4" />Settings</Button>
                        </DropdownMenuItem> */}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem className='py-0'>
                          <Button variant="link" className='w-full h-fit p-0 py-1 justify-start' onClick={() => router.push('/terms-and-privacy')}><Book className="mr-2 h-4 w-4" />Terms an privacy</Button>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem className='py-0'>
                          <Button variant="link" className='w-full h-fit p-0 py-1 justify-start' onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              }
              {
                !isAuthenticated() &&
                <div className='flex gap-3 p-2'>
                  <Button variant="outline" onClick={() => router.push('/auth/register')}>S'inscrire</Button>
                  <Button onClick={() => router.push('/auth/login')}>Connexion</Button>
                </div>
              }
            </div>
          </div>

          <nav className="font-kodchasan flex flex-col dark:bg-neutral-900 bg-gray-50 rounded-r-lg shadow-[3px_0px_25px_0px_rgba(0,0,0,0.1)] col-start-1 row-start-1 col-span-1 row-span-2 relative">
            <IutConnectLogo className='w-full p-5 mt-4 mb-3' style={open ? {} : {padding: '0.25rem'}} />
            {
              isAuthenticated() &&
              <>
                { user.role === 'student' && links.student.map((link) => <NavButton link={link} open={open} key={link.name} />)}
                { user.role === 'tutor' && links.tutor.map((link) => <NavButton link={link} open={open} key={link.name} />)}
                { user.role === 'tutor' && user.is_admin && links.admin.map((link) => <NavButton link={link} open={open} key={link.name} />)}
                { user.role === 'employee' && links.employee.map((link) => <NavButton link={link} open={open} key={link.name} />)}
              </>
            }
            <div className='mt-auto flex flex-col'>
              <ModeToggle open={open} />
              <Button variant="ghost" className='font-bold whitespace-nowrap mb-3 text-gray-500' onClick={() => setOpen(!open)}>
                <ChevronLeft className='data-[open=false]:rotate-180 transition-[transform] duration-300 ease-in-out' data-open={open} /> { open && 'Hide sidebar' }
              </Button>
            </div>
          </nav>

          <div className="col-span-1 row-span-1 p-5 overflow-auto w-full h-full">
            {children}
          </div>
        </div>
      )
    }
  } else {
    return children
  }
}
