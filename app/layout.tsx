import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Texture } from "@/components/texture";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Navbar } from "@/components/navbar";
import { Rail } from "@/components/rail";
import { Footer } from "@/components/footer";

// Body copy. Variable weight axis, so no explicit weight list is needed.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

// Display face for headings. Fredoka is variable across 300-700 and has no
// italic axis — `italic` on these headings renders as a synthesised oblique.
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aashishraj.dev"),
  title: {
    default: "Aashish Raj, Backend & Full-Stack Engineer",
    template: "%s · Aashish Raj",
  },
  description:
    "Aashish Raj is a backend & full-stack engineer and DevOps practitioner. I build clean interfaces and reliable systems, from the pixel to the pipeline.",
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
    title: "Aashish Raj, Backend & Full-Stack Engineer",
    description:
      "Backend & full-stack engineer and DevOps practitioner. I build clean interfaces and reliable systems, from the pixel to the pipeline.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aashish Raj, Backend & Full-Stack Engineer",
    description:
      "Backend & full-stack engineer and DevOps practitioner. I build clean interfaces and reliable systems, from the pixel to the pipeline.",
    creator: "@aashishrajdev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fredoka.variable} dark`}>
      <body className="overflow-x-hidden bg-background text-foreground antialiased font-sans">
        <LenisProvider>
          {/* Ambient fixed texture (dotted grid + grain). */}
          <Texture />

          <Navbar />
          <Rail />
          <Toaster theme="dark" position="bottom-right" />

          <main>{children}</main>

          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
