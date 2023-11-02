import "./globals.css";
import { fontSans } from "#src/utils/font";
import { Providers } from "#src/context/Providers";
import { Topnav } from "#src/components/Topnav";
import { seo } from "#src/utils/seo";
import { BorderWithLabel } from "#src/components/BorderWithLabel";
import { Counter } from "./Counter";

export const metadata = seo({
  title: "Boilerplate app",
  description: "Boilerplate app",
  url: "/",
  image: "/icons/favicon-512x512.png",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body>
        <Providers>
          <Counter />
          <BorderWithLabel label="/layout">
            <Topnav />
            {children}
          </BorderWithLabel>
        </Providers>
      </body>
    </html>
  );
}
