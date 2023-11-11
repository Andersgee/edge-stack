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
  image: "/andyfx.png",
});

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body>
        <Providers>
          <BorderWithLabel label="/layout.tsx">
            <Counter />
            <Topnav />
            {children}
          </BorderWithLabel>
        </Providers>
      </body>
    </html>
  );
}
