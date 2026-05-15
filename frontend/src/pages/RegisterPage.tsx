import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <SignUp
        signInUrl="/login"
        forceRedirectUrl="/games"
        fallbackRedirectUrl="/games"
      />
    </div>
  )
}

export default RegisterPage
