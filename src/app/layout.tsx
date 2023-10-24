import "./globals.css";
import type { Metadata } from "next";
import { fontSans } from "#src/utils/font";
import { Providers } from "#src/context/Providers";
import Topnav from "#src/components/Topnav";

export const metadata: Metadata = {
  title: "cache stack template",
  description: "cache stack template",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body>
        <Providers>
          <Topnav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
