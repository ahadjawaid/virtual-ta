import Logo from "@/components/Logo";

function AuthOutlet(props: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen">
            <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl 
            justify-center md:flex-none md:px-28">
                <main className="flex flex-col gap-y-9 mx-auto w-full max-w-md sm:px-4 md:w-96 
                md:max-w-sm md:px-0">
                    <Logo size="xl" />
                    
                    {props.children}
                </main>
            </div>
            <div className="hidden sm:block sm:flex-1 sm:bg-gradient-to-bl from-indigo-400 from 60% sm:to-purple-300" />
        </div>
    );
}

export default AuthOutlet;