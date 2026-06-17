import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, BookOpenCheck, Brain, GraduationCap, LineChart, Sparkles } from "lucide-react";

import { AnimatedButton } from "@/components/AnimatedButton";
import { Navbar } from "@/components/Navbar";

const TypedLink = Link as ComponentType<any>;

const features = [
  { icon: Brain, title: "Adaptive AI tutor", text: "Explains, re-explains, quizzes, and recommends next steps by learner level." },
  { icon: BookOpenCheck, title: "Session memory", text: "Continue previous topics with saved context, notes, flashcards, and history." },
  { icon: LineChart, title: "Progress analytics", text: "Track streaks, weak areas, scores, and learning consistency." }
];

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm font-bold text-primary shadow-panel">
            <Sparkles className="h-4 w-4" />
            AI learning for every school level
          </div>
          <h1 className="text-balance text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            DD WORLD SCHOOL RESOURCE ASSISTANT
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A premium AI tutor that teaches Early Childhood, Primary, Secondary, and Tertiary learners with personalized explanations, quizzes, flashcards, saved sessions, and analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TypedLink href="/signup">
              <AnimatedButton>
                Start learning
                <ArrowRight className="h-4 w-4" />
              </AnimatedButton>
            </TypedLink>
            <TypedLink href="/workspace">
              <AnimatedButton variant="secondary">Open AI tutor</AnimatedButton>
            </TypedLink>
          </div>
        </div>
        <div className="relative">
          <div className="glass animate-float rounded-3xl p-5 shadow-glow">
            <div className="rounded-2xl bg-background/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary">Live lesson</p>
                  <h2 className="text-2xl font-black">Quadratic Equations</h2>
                </div>
                <GraduationCap className="h-8 w-8 text-coral" />
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-primary p-4 text-sm font-semibold text-primary-foreground">
                  Explain this like I am in Secondary School.
                </div>
                <div className="rounded-2xl border bg-card p-4 text-sm leading-7">
                  A quadratic equation is like a number sentence where the highest power is 2. We solve it by factoring, completing the square, or using a formula.
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["Quiz", "Flashcards", "Notes"].map((item) => (
                    <div key={item} className="rounded-xl border bg-background/70 p-3 text-center text-xs font-bold">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="glass rounded-2xl p-6 shadow-panel">
              <Icon className="mb-5 h-7 w-7 text-primary" />
              <h3 className="text-lg font-black">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.text}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
