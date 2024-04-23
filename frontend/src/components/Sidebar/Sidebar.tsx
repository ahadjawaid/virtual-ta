import { useState, KeyboardEvent, useRef, useEffect, MouseEvent } from 'react';
import { HomeIcon, Cog6ToothIcon, EllipsisHorizontalIcon} from '@heroicons/react/24/outline';
import Logo from '@/components/Logo';

const navigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
];

interface Team {
    id: number;
    name: string;
    initial: string;
    current: boolean;
    href: string;
}

function classNames(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

const Sidebar = () => {
    const [teams, setTeams] = useState<Team[]>([
        { id: 1, name: 'CS2305.002', initial: 'C', current: false, href: '/class/CS2305.002' },
        { id: 2, name: 'LANG1311.001', initial: 'C', current: false, href: '/class/LANG1311.001' },
        { id: 3, name: 'CS4485.0w1', initial: 'C', current: false, href: '/class/CS4485.0w1' },
    ]);

    const [showInput, setShowInput] = useState(false);

    const addTeam = (newTeamName: string) => {
        const newTeam: Team = {
            id: teams.length + 1,
            name: newTeamName,
            initial: newTeamName.charAt(0),
            current: false,
            href: `/class/${newTeamName.split(' ')[0]}-${newTeamName.split(' ')[1]}`,
        };
        setTeams(prevTeams => [...prevTeams, newTeam]);
        setShowInput(false); // Hide input field after adding team
    };

    // Delete team function idk if there is a db that manages the teams
    const deleteTeam = (teamId: number) => {
        // filtering out the team with the specified id and it creates a new team
        setTeams(teams.filter(team => team.id !== teamId));
        setIsModalOpen(false); // close modal
    }

    // State to manage the position of the modal
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);

    const handleEllipsisClick = (teamId: number) => (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setCurrentTeamId(teamId);
        const buttonRect = event.currentTarget.getBoundingClientRect();

        setModalPosition({
            x: buttonRect.left,
            y: buttonRect.bottom + window.scrollY,
        });

        setIsModalOpen(true);
    };


    // Close the modal
    const modalRef = useRef(null); // Ref for the modal div

    useEffect(() => {
        // detect click outside of modal to close it
        function handleClickOutside(event: { target: any; }) {
            if ((modalRef.current as unknown as HTMLElement) && !(modalRef.current as unknown as HTMLElement).contains(event.target)) {
                setIsModalOpen(false);
            }
        }

        // If the modal is open add event listener
        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // clean up
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
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
                                    <li key={team.name} className="group flex items-center justify-between rounded-md p-2 text-sm font-semibold leading-6 hover:bg-indigo-700">
                                        <a
                                            href={team.href}
                                            className={classNames(
                                                team.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                                                'flex items-center space-x-3'
                                            )}
                                        >
                                            <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                                {team.initial}
                                            </span>
                                            <span className="truncate">{team.name}</span>
                                        </a>
                                        <button
                                            onClick={(event) => {
                                                event.preventDefault();
                                                // Call handleEllipsisClick with the correct teamId
                                                handleEllipsisClick(team.id)(event);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            aria-label="Options"
                                        >
                                            <EllipsisHorizontalIcon className="h-5 w-5 text-indigo-200 hover:text-white" />
                                        </button>
                                    </li>
                                ))}
                                {isModalOpen && (<div
                                        className="absolute z-10 w-32 py-2 bg-white rounded shadow-lg text-sm font-semibold"
                                        style={{ top: `${modalPosition.y - 5}px`, left: `${modalPosition.x + 20}px` }}
                                        ref={modalRef}
                                    >
                                        <ul className="text-gray-700">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Rename</li>
                                            <li
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => currentTeamId && deleteTeam(currentTeamId)} // delete using the curr team id
                                            >
                                                Delete
                                            </li>
                                        </ul>
                                    </div>
                                    )}
                                {!showInput && (
                                    <li
                                        className="text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-md p-2 text-sm font-semibold leading-6 cursor-pointer group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                        onClick={() => setShowInput(true)}
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                            +
                                        </span>
                                        <span>Add Team</span>
                                    </li>
                                )}
                                {showInput && (
                                    <li className="text-black-200 hover:bg-indigo-700 rounded-md p-2 text-sm font-semibold leading-6 cursor-pointer">
                                        <input
                                            type="text"
                                            placeholder="Enter team name"
                                            className="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                                            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === 'Enter') {
                                                    addTeam(e.currentTarget.value);
                                                    e.currentTarget.value = ''; // Clear input after adding team
                                                }
                                            }}
                                        />
                                    </li>
                                )}
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
    );
};

export default Sidebar;
