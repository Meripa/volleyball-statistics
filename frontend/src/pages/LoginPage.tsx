import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <SignIn />
    </div>
  )
}

export default LoginPage
