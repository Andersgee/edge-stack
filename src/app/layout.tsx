import "./globals.css";
import { fontSans } from "#src/utils/font";
import { Providers } from "#src/context/Providers";
import Topnav from "#src/components/Topnav";
import { seo } from "#src/utils/seo";

export const metadata = seo({
  title: "Optimistic infinite CRUD example",
  description: "Optimistic infinite CRUD example",
  url: "/",
  image: "/icons/favicon-512x512.png",
});

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
