import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import {
  getMetadataBase,
  OPEN_GRAPH_DEFAULT_IMAGE_ALT,
  OPEN_GRAPH_DEFAULT_IMAGE_PATH,
  OPEN_GRAPH_DEFAULT_IMAGE_SIZE,
} from "@/shared/config";
import { Providers } from "@/root";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "bsuir-iis-api — showcase",
    template: "%s · bsuir-iis-api showcase",
  },
  description:
    "Живая демонстрация npm-пакета bsuir-iis-api: типобезопасный клиент к API ИИС БГУИР, расписание и справочники.",
  openGraph: {
    title: "bsuir-iis-api — showcase",
    description:
      "Демо SDK для API ИИС БГУИР: расписание групп и преподавателей, справочники, фильтры.",
    type: "website",
    url: "/",
    images: [
      {
        url: OPEN_GRAPH_DEFAULT_IMAGE_PATH,
        ...OPEN_GRAPH_DEFAULT_IMAGE_SIZE,
        alt: OPEN_GRAPH_DEFAULT_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bsuir-iis-api — showcase",
    description:
      "Демо SDK для API ИИС БГУИР: расписание групп и преподавателей, справочники, фильтры.",
    images: [OPEN_GRAPH_DEFAULT_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <link rel="preconnect" href="https://iis.bsuir.by" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
