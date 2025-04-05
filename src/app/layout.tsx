import { Providers } from "@/app/providers";
import "./globals.css";
import BaseLayout from "@/layouts/Base";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="vsc-initialized">
        <Providers>
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
}
