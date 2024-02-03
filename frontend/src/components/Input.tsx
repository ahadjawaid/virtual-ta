// import { userFriendlyErrorCodes } from "../services/firebase";

type InputProps = {
    type: string;
    id: string;
    autoComplete: string;
    label: string;
    required?: boolean;
    error?: any;
    children?: any;
}

export default function Input(props: InputProps) {
    return (
        <div className="flex flex-col gap-y-2"> 
            <div className="flex justify-between">
                <label htmlFor={props.id} className={`text-sm font-medium ${props.error ? "text-red-600" : "text-gray-700"}`}>
                    {props.label}
                    {props.required ?  <span className="text-red-600">&nbsp;*</span> : ""}
                </label>
                {props.children}
            </div>

            <input
                id={props.id}
                name={props.id}
                type={props.type}
                autoComplete={props.autoComplete}
                required={props.required}
                className={`block w-full appearance-none focus:outline-none rounded-md border-0 bg-gray-50 
                px-3 py-2 text-gray-900 sm-text shadow-sm ring-1 ring-inset ${props.error ? "ring-red-600" : 
                "ring-gray-300 focus:ring-inset focus:ring-indigo-400"}`}
            />
            {props.error ? (
                <p className={"text-red-600 text-sm text-medium"}>
                    {/* {userFriendlyErrorCodes[props.error.code]} */}
                </p>
            ): null}
        </div>
    );
}