"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

type LayoutChromeProps = {
  children: ReactNode;
};

export default function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname();
  const isDashboardEmbed = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboardEmbed && <Navbar />}
      <main className={isDashboardEmbed ? "" : "mt-20"}>{children}</main>
      {!isDashboardEmbed && <Footer />}
      <Toaster richColors position="top-center" />
    </>
  );
}