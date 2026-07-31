import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const fredoka = Fredoka({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Alimento Canino Ya | Todo para tu perro",
    template: "%s | Alimento Canino Ya",
  },
  description:
    "Alimento balanceado, snacks y accesorios para perros con envío a todo el país. Comprá online de forma fácil, rápida y segura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      suppressHydrationWarning
      className={`${fredoka.variable} ${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
