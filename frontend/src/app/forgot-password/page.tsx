"use client";

// Services
import { useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";

// Outlet
import AuthOutlet from "@/outlets/AuthOutlet";

// Components
import Input from "@/components/Input";
import Button from "@/components/Button";

//Constants
import { paths } from "@/config";

export default function Page() {
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
    const [emailSent, setEmailSent] = useState(false);

    async function handleSubmit(event: any) {
        event.preventDefault();
        const email = event.currentTarget.email.value;

        setEmailSent(await sendPasswordResetEmail(email));
    }

    return (
        <AuthOutlet>
            <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                        Reset your password
                </h2>
                <p className="text-sm text-gray-700">
                    Remember your password?&nbsp;
                    <a href={paths.login} className="font-medium text-md text-indigo-600 
                    hover:underline">
                        Sign in&nbsp;
                    </a>
                    to your account.
                </p>
            </div>
            <form onSubmit={handleSubmit} method="POST" className="flex flex-col gap-y-7">
                <Input type="email" id="email" autoComplete="email" label="Email Address" required />
                <Button type="submit" w-full>Send reset link</Button>
                {emailSent ? (
                    <p className="bg-indigo-100 rounded-md px-3 py-2 text-center text-sm text-indigo-900">
                        If an account with that email exists, we sent you an email with a link to reset your password.
                    </p>
                ) : null}
            </form>
        </AuthOutlet>
    );
}