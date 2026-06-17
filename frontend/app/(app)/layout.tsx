import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen">
      <Sidebar />
      <section className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/70 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase text-primary">DD World School Resource Assistant</p>
            <p className="text-sm text-muted-foreground">Personalized learning command center</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="p-4 lg:p-8">{children}</div>
      </section>
    </main>
  );
}
