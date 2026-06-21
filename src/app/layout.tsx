import type { Metadata } from "next";
import { Public_Sans, Luckiest_Guy, Darker_Grotesque } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { AppShell } from "../components/layout/AppShell";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sans",
});

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-grotesque",
});

export const metadata: Metadata = {
  title: "GreenTrace | Track your footprint. Change your impact.",
  description: "GreenTrace helps you understand where your emissions come from, track daily habits, and reduce your impact through simple personalized actions and live simulators.",
  keywords: ["carbon tracker", "climate action", "carbon calculator", "green habits", "carbon footprint"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} ${luckiestGuy.variable} ${darkerGrotesque.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-brand-bg text-black font-sans">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
