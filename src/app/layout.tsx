import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoDoc AI - Generate Perfect READMEs",
  description: "Transform your repositories with AI-powered README generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" />
        <style>{`
        :root {
          --font-inter: 'Inter', sans-serif;
        }
      `}</style>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}