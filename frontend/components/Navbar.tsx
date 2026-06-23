"use client";

import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Sparkles } from "lucide-react";

import { AnimatedButton } from "@/components/AnimatedButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand-mark.svg" alt="DD World" width={40} height={40} className="rounded-xl" />
          <div>
            <p className="text-sm font-black leading-none">DD WORLD</p>
            <p className="text-xs text-muted-foreground">School Resource Assistant</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <Link href="/workspace" className="hover:text-foreground">AI Tutor</Link>
          <Link href="/quiz" className="hover:text-foreground">Quiz</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-semibold sm:block">Login</Link>
              <Link href="/signup">
                <AnimatedButton className="px-4">
                  <Sparkles className="h-4 w-4" />
                  Start
                  <ArrowRight className="h-4 w-4" />
                </AnimatedButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
