import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <SignIn
        signUpUrl="/register"
        forceRedirectUrl="/games"
        fallbackRedirectUrl="/games"
      />
    </div>
  )
}

export default LoginPage
