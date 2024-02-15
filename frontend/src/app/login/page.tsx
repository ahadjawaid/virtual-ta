"use client";

// Services
import { useState } from "react";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { redirect } from "next/navigation";

// Outlets
import AuthOutlet from "@/outlets/AuthOutlet"

// Components
import AccountButton from '@/components/AccountButton';
import WordDivider from "@/components/WordDivider";
import Input from "@/components/Input";
import Button from "@/components/Button";

// Constants
import { paths, signInOptions } from '@/config';

export default function Home() {
  const [isRedirect, setIsRedirect] = useState<boolean>(false);
  const [signInWithEmailAndPassword, emailUser, emailLoading, emailError] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

  async function handleSubmit(type: string, event: any) {
    event.preventDefault();

    let userCred: any = null;
    if (type == "email") {
      const form = event.currentTarget;
      const email = form.email.value;
      const password = form.password.value;

      userCred = await signInWithEmailAndPassword(email, password);
    } else {
      userCred = await signInWithGoogle();
    }

    if (userCred) {
      setIsRedirect(true);
    }
  }

  return (
    <AuthOutlet>
      <div className="flex flex-col gap-y-2">
        <h2 className="text-lg font-semibold text-gray-900">
          Sign in to your account
        </h2>

        <p className="text-sm text-gray-700">
          Don’t have an account?&nbsp;
          <a href={paths.register} className="font-medium text-md text-indigo-600 
                    hover:underline">
            Sign Up&nbsp;
          </a>
          to contribute.
        </p>
      </div>

      <div className='flex flex-col gap-y-4 '>
        {
          signInOptions.map(option => (
            <AccountButton
              key={option.name}
              onClick={(e: any) => { handleSubmit(option.name, e) }}
              name={option.name}
              logo={option.logo}
            />
          ))
        }
      </div>

      <WordDivider>or</WordDivider>

      <form method="POST" onSubmit={(event: any) => handleSubmit("email", event)} className="flex flex-col gap-y-7">
        <Input type="email" id="email" autoComplete="email" label="Email Address" required />
        <Input type="password" id="password" autoComplete="current-password" label="Password" required>
          <a href={paths.forgotPassword} className="text-sm text-indigo-600 hover:underline">
            Forgot your password?
          </a>
        </Input>
        <Button type="submit" w-full>sign in</Button>
      </form>

      {isRedirect && redirect(paths.home)}
    </AuthOutlet>
  )
}