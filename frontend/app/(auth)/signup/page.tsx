"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { UserPlus } from "lucide-react";

import { AnimatedButton } from "@/components/AnimatedButton";
import { useSignup } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const mutation = useSignup();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await mutation.mutateAsync({ full_name: fullName, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8 shadow-glow">
        <p className="text-sm font-bold text-primary">Create your learning profile</p>
        <h1 className="mt-2 text-3xl font-black">Start with DD World</h1>
        <div className="mt-8 space-y-4">
          <input className="h-12 w-full rounded-xl border bg-background/70 px-4 outline-none focus:ring-2 focus:ring-ring" placeholder="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <input className="h-12 w-full rounded-xl border bg-background/70 px-4 outline-none focus:ring-2 focus:ring-ring" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input className="h-12 w-full rounded-xl border bg-background/70 px-4 outline-none focus:ring-2 focus:ring-ring" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <AnimatedButton disabled={mutation.isPending} className="w-full" type="submit">
            <UserPlus className="h-4 w-4" />
            Create account
          </AnimatedButton>
        </div>
        {error && <p className="mt-4 rounded-xl border border-coral bg-coral/10 p-3 text-sm font-semibold text-coral">{error}</p>}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered? <Link className="font-bold text-primary" href="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
