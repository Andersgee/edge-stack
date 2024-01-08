import "./globals.css";
import { fontSans } from "#src/utils/font";
import { apiRsc } from "#src/trpc/api-rsc";
import { Providers } from "#src/context/Providers";
import { seo } from "#src/utils/seo";
import { TopnavLink } from "#src/components/TopnavLink";
import { ProfileButton } from "#src/components/user/ProfileButton";

export const metadata = seo({
  title: "Boilerplate app",
  description: "Boilerplate app",
  url: "/",
  image: "/andyfx.png",
});

export const runtime = "edge";
//export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  void apiRsc(); //preload, see https://react.dev/reference/react/cache#preload-data
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

async function Topnav() {
  const { user } = await apiRsc();
  //const user = useStore.use.user();
  return (
    <div className="m-2 flex items-center justify-between">
      <div>
        <div className="flex flex-col md:flex-row">
          <TopnavLink label="Home" href="/" />
          <TopnavLink label="Posts" href="/posts" />
        </div>
      </div>
      <div>
        <ProfileButton user={user} />
      </div>
    </div>
  );
}
