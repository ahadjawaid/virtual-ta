"use client";

// Components
import Input from "@/components/Input";
import Button from "@/components/Button";
import AuthOutlet from "@/outlets/AuthOutlet";
import AccountButton from "@/components/AccountButton";
import WordDivider from "@/components/WordDivider";

// Constants
import { paths, signInOptions } from "@/config";


export default function Page() {
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
              onClick={() => {}}
              name={option.name}
              logo={option.logo}
            />
          ))
        }
      </div>

      <WordDivider>or</WordDivider>

      <form method="POST" onSubmit={() => {}} className="flex flex-col gap-y-7">
        <div className="flex gap-x-4">
          <Input type="text" id="firstName" autoComplete="given-name" label="First Name" required />
          <Input type="text" id="lastName" autoComplete="family-name" label="Last Name" required />
        </div>
        <Input type="email" id="email" autoComplete="email" label="Email Address" required />
        <Input type="password" id="password" autoComplete="current-password" label="Password" required />
        {/* <Select label="How did you hear about us?" options={surveyOptions} /> */}
        <Button type="submit" w-full>sign up</Button>
      </form>
    </AuthOutlet>
  );
}