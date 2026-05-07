import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutChrome from "@/components/LayoutChrome";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Evaluasi Pasca Pelatihan Nasional - LANRI",
  description: "Evaluasi Pasca Pelatihan Nasional - LANRI",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}

