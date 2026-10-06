import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProvider } from "../components/app-provider";
import { AppShell } from "../components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Odinbook — A place to connect",
  description: "Share what matters and stay connected with your community.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
