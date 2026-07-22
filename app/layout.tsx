import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Polonês 3.0 | Márcio Polonês",
    template: "%s | Polonês 3.0",
  },
  description:
    "Aprenda polonês com uma aula por dia durante 365 dias pelo método Polonês 3.0.",
  keywords: [
    "curso de polonês",
    "aprender polonês",
    "polonês para iniciantes",
    "Márcio Polonês",
    "Polonês 3.0",
  ],
  openGraph: {
    title: "Polonês 3.0 | Márcio Polonês",
    description:
      "Uma aula por dia durante 365 dias para você aprender polonês.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/capa-polones-3.jpg",
        width: 800,
        height: 1200,
        alt: "Curso Polonês 3.0",
      },
    ],
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}