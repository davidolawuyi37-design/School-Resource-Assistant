"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";

import { AnimatedButton } from "@/components/AnimatedButton";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const mutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await mutation.mutateAsync({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8 shadow-glow">
        <p className="text-sm font-bold text-primary">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black">Login to your tutor</h1>
        <div className="mt-8 space-y-4">
          <input className="h-12 w-full rounded-xl border bg-background/70 px-4 outline-none focus:ring-2 focus:ring-ring" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input className="h-12 w-full rounded-xl border bg-background/70 px-4 outline-none focus:ring-2 focus:ring-ring" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <AnimatedButton disabled={mutation.isPending} className="w-full" type="submit">
            <LogIn className="h-4 w-4" />
            Login
          </AnimatedButton>
        </div>
        {error && <p className="mt-4 rounded-xl border border-coral bg-coral/10 p-3 text-sm font-semibold text-coral">{error}</p>}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? <Link className="font-bold text-primary" href="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
