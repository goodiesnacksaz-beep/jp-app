import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "KOTOBAnime - Learn Japanese Through Anime",
    description: "Master Japanese vocabulary by taking quizzes based on your favorite anime episodes.",
    openGraph: {
        title: "KOTOBAnime - Learn Japanese Through Anime",
        description: "Master Japanese vocabulary by taking quizzes based on your favorite anime episodes.",
        type: "website",
        url: "https://kotobanime.com",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5877458992457161"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </head>
            <body className={inter.className}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
