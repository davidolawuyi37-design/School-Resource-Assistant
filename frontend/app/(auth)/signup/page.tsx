import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="glass w-full max-w-md rounded-3xl p-8 shadow-glow">
        <p className="text-sm font-bold text-primary">Create your learning profile</p>
        <h1 className="mt-2 text-3xl font-black">Start with DD World</h1>
        <div className="mt-8">
          <SignUp
            routing="path"
            path="/signup"
            signInUrl="/login"
            forceRedirectUrl="/dashboard"
            appearance={{ elements: { rootBox: "w-full", cardBox: "w-full", card: "w-full shadow-none" } }}
          />
        </div>
      </section>
    </main>
  );
}
