import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; // Import Montserrat
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { AppHeader } from "@/components/header";
import { footerData } from "@/config/footer-config";
import Footer from "@/components/footer/Footer";


const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify weights
});

export const metadata: Metadata = {
  title: "Vibe Better",
  description: "Optimize your coding prompts with AI analysis.",
  openGraph: {
    title: "Vibe Better",
    description: "Optimize your coding prompts with AI analysis.",
    type: "website",
    url: "https://vibebetter.com",
    siteName: "Vibe Better",
    images: [
      {
        url: "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1747673196/og-image_jeyooo.jpg",
        width: 1200,
        height: 630,
        alt: "Vibe Better",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: "hsl(240 10% 4%)",
          colorPrimary: "hsl(180 100% 50%)",
        },
      }}
    >
      <html lang="es">
        <Head>
          <title>Vibe Better</title>
          <meta
            name="description"
            content="Optimize your coding prompts with AI analysis."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        <body
          className={`${montserrat.variable} antialiased bg-background text-foreground`}
        >
          <AppHeader />
          <main className="pb-32">{children}</main>
          <Footer config={footerData.config} />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
