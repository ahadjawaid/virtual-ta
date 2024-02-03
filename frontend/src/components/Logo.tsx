import { logo } from "@/config";

type LogoProps = {
    size: string;
    hide?: boolean;
}

export default function Logo(props: LogoProps) {
    return (
        <a aria-label="Home" href={logo.link} className="flex gap-x-1.5 items-center">
            <img src={logo.path} height={50} width={50} alt="Paper Leaderboard" />
            <span className={`${props.hide ? "hidden md:inline" : "inline"} 
             text-${props.size} tracking-tight font-bold text-slate-700`}>
                {logo.text}
                <span className="text-indigo-500">
                    {logo.coloredText}
                </span>
            </span>
        </a>
    );
}