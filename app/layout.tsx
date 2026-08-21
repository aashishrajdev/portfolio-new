import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Texture } from "@/components/texture";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { SignalCursor } from "@/components/signal-cursor";
import { Navbar } from "@/components/navbar";
import { Rail } from "@/components/rail";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aashishraj.dev"),
  title: {
    default: "Aashish Raj — Backend & Full-Stack Engineer",
    template: "%s · Aashish Raj",
  },
  description:
    "Aashish Raj — backend & full-stack engineer and DevOps practitioner. I build clean interfaces and reliable systems, from the pixel to the pipeline.",
  keywords: [
    "Aashish Raj",
    "Backend Engineer",
    "Full-Stack Developer",
    "DevOps",
    "TypeScript",
    "Node.js",
    "Python",
    "FastAPI",
    "Next.js",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Distributed Systems",
  ],
  authors: [{ name: "Aashish Raj", url: "https://github.com/aashishrajdev" }],
  creator: "Aashish Raj",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aashishraj.dev",
    siteName: "Aashish Raj",
    title: "Aashish Raj — Backend & Full-Stack Engineer",
    description:
      "Backend & full-stack engineer and DevOps practitioner. I build clean interfaces and reliable systems - from the pixel to the pipeline.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aashish Raj — Backend & Full-Stack Engineer",
    description:
      "Backend & full-stack engineer and DevOps practitioner. I build clean interfaces and reliable systems - from the pixel to the pipeline.",
    creator: "@aashishrajdev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="overflow-x-hidden bg-background text-foreground antialiased font-sans">
        <ThemeProvider>
          <LenisProvider>
            {/* Ambient fixed texture (dotted grid + grain). */}
            <Texture />

            <SignalCursor />
            <Navbar />
            <Rail />
            <CommandPalette />
            <Toaster theme="dark" position="bottom-right" />

            <main>{children}</main>

            <Footer />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
