import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Quicksand, Playfair_Display } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { mantineTheme } from "@/theme/mantine-theme";
import "@/styles/mantine.css";
import "./globals.css";
import BilingualNavigation from "@/components/layout/bilingual-navigation";
import { BilingualFooter } from "@/components/layout/bilingual-footer";
import { ThemeProvider } from "@/contexts/theme-context";
import { UserPreferencesProvider } from "@/contexts/user-preferences-context";
import { LanguageProvider } from "@/contexts/language-context";
import { BackToTop, ScrollProgress } from "@/components/ui/back-to-top";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SkipNavigation } from "@/components/ui/skip-link";
import { ScreenReaderAnnouncer } from "@/components/ui/screen-reader-announcer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: 'swap',
  weight: ['500', '600', '700'],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "FairVeri - FAIR Veri Prensipleri",
  description: "FAIR veri prensipleri ile verilerinizin bulunabilirliğini, erişilebilirliğini, birlikte çalışabilirliğini ve yeniden kullanılabilirliğini artırın. Kapsamlı değerlendirme araçları ve rehberler.",
  keywords: ["FAIR veri", "veri yönetimi", "veri prensipleri", "bulunabilirlik", "erişilebilirlik", "birlikte çalışabilirlik", "yeniden kullanılabilirlik"],
  authors: [{ name: "FairVeri Team" }],
  creator: "FairVeri",
  openGraph: {
    title: "FairVeri - FAIR Veri Prensipleri",
    description: "FAIR veri prensipleri ile verilerinizin değerini artırın",
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "FairVeri - FAIR Veri Prensipleri",
    description: "FAIR veri prensipleri ile verilerinizin değerini artırın",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#fbfbf8",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <ColorSchemeScript defaultColorScheme="light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='fairveri-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t='light';}var d=document.documentElement;d.setAttribute('data-theme',t);d.setAttribute('data-mantine-color-scheme',t);d.classList.add(t);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${quicksand.variable} ${playfair.variable} antialiased`}
      >
        <LanguageProvider defaultLanguage="tr">
          <MantineProvider theme={mantineTheme} defaultColorScheme="light">
            <Notifications position="top-right" zIndex={1000} />
            <ThemeProvider defaultTheme="light" storageKey="fairveri-theme">
              <UserPreferencesProvider storageKey="fairveri-user-preferences">
                <ErrorBoundary>
                  <SkipNavigation />
                  <ScreenReaderAnnouncer />
                  <ScrollProgress position="top" />
                  <div className="min-h-screen flex flex-col">
                    <BilingualNavigation />
                    <main id="main-content" className="flex-1" tabIndex={-1} role="main">
                      {children}
                    </main>
                    <BilingualFooter />
                  </div>
                  <BackToTop threshold={400} showProgressRing />
                </ErrorBoundary>
              </UserPreferencesProvider>
            </ThemeProvider>
          </MantineProvider>
        </LanguageProvider>
        
      </body>
    </html>
  );
}
