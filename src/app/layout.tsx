import type { Metadata } from "next";
import { Inter, Rajdhani, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rajdhani = Rajdhani({
    weight: ['500', '600', '700'],
    subsets: ["latin"],
    variable: "--font-rajdhani",
    style: ['normal']
});
const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    weight: ['400', '500', '700', '900']
});

export const metadata: Metadata = {
    title: "PITCH ENGINE - Sort the Squad",
    description: "The tactical board for real life. Manage your Sunday League team like a pro.",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#0A120A",
    viewportFit: "cover",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${rajdhani.variable} ${outfit.variable} font-sans bg-wts-dark text-white antialiased`}>
                {children}
            </body>
        </html>
    );
}
