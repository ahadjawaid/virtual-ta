// Sidebar.tsx
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Logo from '@/components/Logo';
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
  } from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    // { name: 'Team', href: '#', icon: UsersIcon, current: false },
    // { name: 'Projects', href: '#', icon: FolderIcon, current: false },
    // { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
    // { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
    // { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
  ]
  const teams = [
    { id: 1, name: 'CS 4485', initial: 'C', current: false },
    { id: 2, name: 'CS 4365', initial: 'C', current: false },
    { id: 3, name: 'CS 4314', initial: 'C', current: false },
  ].map(team => ({
    ...team,
    href: `/class/${team.name.split(' ')[0]}-${team.name.split(' ')[1]}`, // because the class page uses the class id number
  }));
  
  const userNavigation = [
    { name: 'Your profile', href: '/profile' },
    { name: 'Sign out', href: '/login' },
  ]
  
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
  }
  
const Sidebar = () => {

const [sidebarOpen, setSidebarOpen] = useState(false)
return (
    <>
    {/* Static sidebar for desktop */}
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    {/* Sidebar component, swap this element with another sidebar if you like */}
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
    <Logo size="xl" />
    <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
            <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
                <li key={item.name}>
                <a
                    href={item.href}
                    className={classNames(
                    item.current
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                >
                    <item.icon
                    className={classNames(
                        item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                        'h-6 w-6 shrink-0'
                    )}
                    aria-hidden="true"
                    />
                    {item.name}
                </a>
                </li>
            ))}
            </ul>
        </li>
        <li>
            <div className="text-xs font-semibold leading-6 text-indigo-200">Your classes</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
            {teams.map((team) => (
                <li key={team.name}>
                <a
                    href={team.href}
                    className={classNames(
                    team.current
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                    {team.initial}
                    </span>
                    <span className="truncate">{team.name}</span>
                </a>
                </li>
            ))}
            </ul>
        </li>
        <li className="mt-auto">
            <a
            href="/settings"
            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
            >
            <Cog6ToothIcon
                className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                aria-hidden="true"
            />
            Settings
            </a>
        </li>
        </ul>
    </nav>
    </div>
    </div>
    </>
    )
};

export default Sidebar;