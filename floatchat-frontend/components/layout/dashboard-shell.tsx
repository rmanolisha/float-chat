import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-6 lg:px-6">
      <aside className="hidden w-80 shrink-0 lg:block">
        <Sidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar />
        {children}
      </div>
    </div>
  );
}
