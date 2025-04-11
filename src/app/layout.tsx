import { Providers } from "@/app/providers";
import "./globals.css";
import BaseLayout from "@/layouts/Base";
import { GeistSans } from "geist/font/sans";

export const metadata = {
  title: "Inbang Today",
  description: "Inbang Today Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`vsc-initialized ${GeistSans.className}`}>
        <Providers>
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
}
