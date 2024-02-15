type AccountButtonProps = {
    onClick: any;
    name: string;
    logo: string | JSX.Element;
}

const uppercase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function AccountButton(props: AccountButtonProps) {
    return (
        <button type='button' onClick={props.onClick} className='shadow-sm ring-1 ring-inset ring-gray-300 
        hover:ring-indigo-400 rounded-md py-1.5 px-3 flex justify-center group transition duration-150 ease-out'>
            <div className='flex items-center gap-x-4'>
                <div>
                    {props.logo}
                </div>
                <p className='text-md font-light text-slate-700 group-hover:text-indigo-700'>
                    Continue with {uppercase(props.name)}
                </p>
            </div>
        </button>
    );
}