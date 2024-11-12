import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/RTK/provider";
import {NextUIProvider} from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "ISHA",
  description: "Making diagnosis better and faster!"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <head>
            <link rel="icon" href="/icons/favicon.ico" sizes="any" /> 
          </head>
          <body>
            {/* TODO: Add dark theme */}
          <NextUIProvider>
            <ThemeProvider defaultTheme="light" enableSystem={false} attribute="class"> 
              <ReduxProvider>  
                  {children}
                  <Analytics/>
              </ReduxProvider>
            </ThemeProvider>
          </NextUIProvider>
          </body>
      </html>
  );
}
