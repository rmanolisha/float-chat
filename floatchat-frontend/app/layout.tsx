import type { Metadata } from "next";

import { ToastProvider } from "@/components/providers/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FloatChatAI",
  description: "Premium ocean intelligence workspace for ARGO float data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
