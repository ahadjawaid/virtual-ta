type ButtonProps = {
    type: "submit" | "button" | "reset";
    children: any;
    onClick?: () => void;
    disabled?: boolean;
    "w-full"?: boolean;
}

export default function Button(props: ButtonProps) {
    return (
        <button 
            onClick={props.onClick} 
            disabled={props.disabled} 
            type={props.type} 
            className={`group rounded-full inline-flex 
            items-center justify-center py-2 px-4 text-sm font-semibold bg-indigo-500 text-white 
            hover:text-slate-100 hover:bg-indigo-400 active:bg-indigo-800 active:text-indigo-100 
            focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none capitalize 
            ${props["w-full"] ? "w-full" : "py-2 px-4"}`}
        >
            {props.children}&nbsp;
            
            {props.type == "submit" ? (
                <span className="inline-block group-hover:translate-x-0.5 transition duration-150 
                ease-in-out" aria-hidden={true}>
                    →
                </span>
            ): null}
        </button>
    );
}