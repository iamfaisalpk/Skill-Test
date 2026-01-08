import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import AuthInitializer from "./AuthInitializer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Test",
  description: "Mini E-commerce Skill Test",
  icons: {
    icon: "/images/shoeImage.png",
    apple: "/images/shoeImage.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#161616] text-white min-h-screen flex flex-col`}
      >
        <AuthInitializer />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
        />
      </body>
    </html>
  );
}
