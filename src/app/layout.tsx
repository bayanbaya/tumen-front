"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter, Lobster, Vollkorn } from "next/font/google";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });
const lobster = Lobster({ 
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster"
});

const vollkorn = Vollkorn({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-vollkorn"
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
        <link rel="icon" href="/images/logo/tumen-logo.png" />
        <link rel="apple-touch-icon" href="/images/logo/tumen-logo.png" />
      </head>

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className} ${lobster.variable} ${vollkorn.variable}`}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";

