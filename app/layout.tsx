import type { Metadata } from "next";
import { Playfair_Display, Outfit, Caveat } from "next/font/google";
import { DATA } from "@/data/portfolio";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import MusicPlayer from "@/components/MusicPlayer";
import NameGate from "@/components/NameGate";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sakura ✿ Portfolio",
  description: "Software Engineer & Database Specialist",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable} ${caveat.variable}`}>
      <body>
        <div className="bg-blobs" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="blob blob-4" />
        </div>
        <div className="content">
          <Nav name={DATA.name} />
          <main>{children}</main>
          <Footer name={DATA.name} />
          <ScrollReveal />
          <MusicPlayer />
          <NameGate />
        </div>
      </body>
    </html>
  );
}
