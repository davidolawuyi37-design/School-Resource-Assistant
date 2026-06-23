import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="glass w-full max-w-md rounded-3xl p-8 shadow-glow">
        <p className="text-sm font-bold text-primary">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black">Login to your tutor</h1>
        <div className="mt-8">
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/signup"
            forceRedirectUrl="/dashboard"
            appearance={{ elements: { rootBox: "w-full", cardBox: "w-full", card: "w-full shadow-none" } }}
          />
        </div>
      </section>
    </main>
  );
}
