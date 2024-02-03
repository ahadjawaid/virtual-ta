type WordDividerProps = {
    children: string;
}

export default function WordDivider(props: WordDividerProps) {
    return (
        <div className='flex justify-between items-center gap-x-4'>
            <div className='h-[1px] w-full bg-slate-300 rounded-md' />
            <p className='text-center text-sm font-medium text-slate-700'>
                {props.children}
            </p>
            <div className='h-[1px] w-full bg-slate-300 rounded-md' />
        </div>
    );
}