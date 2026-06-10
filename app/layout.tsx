import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Academic Pathway — Find Your Next Degree",
  description:
    "Get a personalized academic pathway recommendation based on your background, experience, and career goals. Powered by AI.",
  keywords: ["academic", "education", "career", "doctorate", "PhD", "DBA", "certification"],
  openGraph: {
    title: "Academic Pathway Recommendation Engine",
    description: "Discover the right academic path for your career.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
