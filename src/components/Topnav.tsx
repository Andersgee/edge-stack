import { apiRsc } from "#src/trpc/api-rsc";
import { ProfileButton } from "./ProfileButton";
import { BorderWithLabel } from "./BorderWithLabel";
import { TopnavLink } from "./TopnavLink";

export async function Topnav() {
  const { user } = await apiRsc();

  return (
    <BorderWithLabel label="Topnav">
      <div className="m-2 flex items-center justify-between">
        <div>
          <div className="flex">
            <TopnavLink label="Home" href="/" />
            <TopnavLink label="rsc slow" href="/rsc-slow" />
            <TopnavLink label="rsc slow with suspense" href="/rsc-slow-with-suspense" />
            <TopnavLink label="slow" href="/slow" />
            <TopnavLink label="best-of-both" href="/best-of-both" />
          </div>
        </div>
        <div>
          <ProfileButton user={user} />
        </div>
      </div>
    </BorderWithLabel>
  );
}
