"use client";
import AuthOutlet from "@/outlets/AuthOutlet"
import { paths, signInOptions } from '@/config';
import AccountButton from '@/components/AccountButton';
import WordDivider from "@/components/WordDivider";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Home() {
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
              onClick={() => {}}
              name={option.name}
              logo={option.logo}
            />
          ))
        }
      </div>

      <WordDivider>or</WordDivider>

      <form method="POST" className="flex flex-col gap-y-7">
        <Input type="email" id="email" autoComplete="email" label="Email Address" required />
        <Input type="password" id="password" autoComplete="current-password" label="Password" required>
          <a href={paths.forgotPassword} className="text-sm text-indigo-600 hover:underline">
            Forgot your password?
          </a>
        </Input>
        <Button type="submit" w-full>sign in</Button>
      </form>
    </AuthOutlet>
  )
}