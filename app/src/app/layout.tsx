import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { THEME_SCRIPT } from "@/features/theme/theme";
import "./globals.css";

// Latin subsets from Google Fonts, served from the app so they work offline
const jost = localFont({
  src: "./fonts/jost-latin.woff2",
  weight: "400 600",
  variable: "--font-jost",
});

const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/newsreader-latin-italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-newsreader",
});

const playfair = localFont({
  src: "./fonts/playfair-display-latin-italic.woff2",
  weight: "500 700",
  style: "italic",
  variable: "--font-playfair",
});

const greatVibes = localFont({
  src: "./fonts/great-vibes-latin.woff2",
  weight: "400",
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "Mercaplanner · Plan de dieta",
  description: "Qué toca comer hoy, las recetas, el calendario de la semana, la cesta y los productos de Mercadona.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f2e3" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1814" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jost.variable} ${newsreader.variable} ${playfair.variable} ${greatVibes.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved theme before the first paint (see features/theme/theme.ts) */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
