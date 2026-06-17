"use client";

import { Bell, Mic, ShieldCheck } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { usePreferencesStore } from "@/store/preferences-store";

export default function SettingsPage() {
  const { compactMode, voiceEnabled, setCompactMode, setVoiceEnabled } = usePreferencesStore();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-bold text-primary">Settings</p>
        <h1 className="text-3xl font-black">Personalize your learning space</h1>
      </div>

      <section className="glass rounded-2xl p-5 shadow-panel">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-black">Appearance</h2>
              <p className="text-sm text-muted-foreground">Switch between dark and light mode.</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </section>

      <section className="glass rounded-2xl p-5 shadow-panel">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Mic className="h-6 w-6 text-coral" />
            <div>
              <h2 className="font-black">Voice tutor</h2>
              <p className="text-sm text-muted-foreground">Prepare the interface for spoken lessons.</p>
            </div>
          </div>
          <input type="checkbox" checked={voiceEnabled} onChange={(event) => setVoiceEnabled(event.target.checked)} className="h-5 w-5 accent-primary" />
        </div>
      </section>

      <section className="glass rounded-2xl p-5 shadow-panel">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Bell className="h-6 w-6 text-warning" />
            <div>
              <h2 className="font-black">Compact dashboard</h2>
              <p className="text-sm text-muted-foreground">Use a denser layout for frequent study sessions.</p>
            </div>
          </div>
          <input type="checkbox" checked={compactMode} onChange={(event) => setCompactMode(event.target.checked)} className="h-5 w-5 accent-primary" />
        </div>
      </section>
    </div>
  );
}
