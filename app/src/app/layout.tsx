import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { THEME_SCRIPT } from "@/features/theme/theme";
import "./globals.css";

// Same latin subsets the original index.html inlined (Newsreader v26 and
// Figtree v9 from Google Fonts), served from the app so they work offline
const newsreader = localFont({
  src: "./fonts/newsreader-latin.woff2",
  weight: "500 700",
  variable: "--font-newsreader",
});

const figtree = localFont({
  src: [
    { path: "./fonts/figtree-latin.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/figtree-latin-italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Plan de dieta",
  description: "Qué toca comer hoy, las recetas, el plan de la semana y los productos de Mercadona.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eaedee" },
    { media: "(prefers-color-scheme: dark)", color: "#14181a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${figtree.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved theme before the first paint (see lib/theme.ts) */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
