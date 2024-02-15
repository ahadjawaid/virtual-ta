"use client";

import { useState } from "react";
import { redirect } from "next/navigation";

// Services
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";

// Components
import Input from "@/components/Input";
import Button from "@/components/Button";
import AuthOutlet from "@/outlets/AuthOutlet";
import AccountButton from "@/components/AccountButton";
import WordDivider from "@/components/WordDivider";

// Constants
import { paths, signInOptions } from "@/config";


export default function Page() {
  const [createUserWithEmailAndPassword, emailUser, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const [isRedirect, setIsRedirect] = useState(false);

  async function handleSubmit(type: string, event: any) {
    event.preventDefault();

    let name: string | null | undefined;
    let userCred: any;
    if (type == "email") {
      const form = event.currentTarget;
      const firstName = form.firstName.value;
      const lastName = form.lastName.value;
      const email = form.email.value;
      const password = form.password.value;
      name = `${firstName} ${lastName}`
      console.log(name, email, password);

      userCred = await createUserWithEmailAndPassword(email, password);
    } else {
      userCred = await signInWithGoogle()
      name = userCred?.user?.displayName
    }

    if (userCred) {
      setIsRedirect(true);
    }
  }

  return (
    <AuthOutlet>
      <div className="flex flex-col gap-y-2">
        <h2 className="text-lg font-semibold text-gray-900">
          Sign up to upvote!
        </h2>

        <p className="text-sm text-gray-700">
          Already registered?&nbsp;
          <a href={paths.login} className="font-medium text-md text-indigo-600 
                    hover:underline">
            Sign in&nbsp;
          </a>
          to your account.
        </p>
      </div>

      <div className='flex flex-col gap-y-4 '>
        {
          signInOptions.map(option => (
            <AccountButton
              key={option.name}
              onClick={(event: any) => handleSubmit(option.name, event)}
              name={option.name}
              logo={option.logo}
            />
          ))
        }
      </div>

      <WordDivider>or</WordDivider>

      <form method="POST" onSubmit={(event: any) => handleSubmit("email", event)} className="flex flex-col gap-y-7">
        <div className="flex gap-x-4">
          <Input type="text" id="firstName" autoComplete="given-name" label="First Name" error={error} required />
          <Input type="text" id="lastName" autoComplete="family-name" label="Last Name" error={error} required />
        </div>
        <Input type="email" id="email" autoComplete="email" label="Email Address" error={error} required />
        <Input type="password" id="password" autoComplete="current-password" label="Password" error={error} required />
        <Button type="submit" disabled={loading} w-full>sign up</Button>
      </form>

      {isRedirect && redirect(paths.home)}
    </AuthOutlet>
  );
}