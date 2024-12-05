import { Providers } from "@/app/providers";
import Header from "@/components/Header";
import "./globals.css";
import BaseLayout from "@/layouts/Base";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
}
