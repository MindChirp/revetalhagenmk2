import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { type Metadata } from "next";
import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Header from "@/components/ui/header";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import "@schedule-x/theme-shadcn/dist/index.css";
import Footer from "@/components/screen/footer/footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Revetalhagen",
  description: "Et sted for alle å være",
  icons: [{ rel: "icon", url: "/images/nakuhel-logo.webp" }],
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} min-h-screen max-w-screen`}>
      <body>
        <Analytics />
        <NuqsAdapter>
          <TRPCReactProvider>
            <Header />
            <div className="min-h-screen">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
            <Footer className="mt-20" />
            <Toaster position="top-center" />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
