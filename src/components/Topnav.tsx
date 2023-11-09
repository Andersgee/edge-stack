import { ProfileButton } from "./ProfileButton";
import { BorderWithLabel } from "./BorderWithLabel";
import { TopnavLink } from "./TopnavLink";
import { apiRsc } from "#src/trpc/api-rsc";

export async function Topnav() {
  const { user } = await apiRsc();
  //const user = useStore.use.user();
  return (
    <BorderWithLabel label="Topnav">
      <div className="m-2 flex items-center justify-between">
        <div>
          <div className="flex flex-col md:flex-row">
            <TopnavLink label="Home" href="/" />
            <TopnavLink label="rsc data" href="/rsc-data" />
            <TopnavLink label="rsc data suspense" href="/rsc-data-suspense" />
            <TopnavLink label="client data" href="/client-data" />
            <TopnavLink label="client suspense data" href="/client-suspense-data" />
          </div>
        </div>
        <div>
          <ProfileButton user={user} />
        </div>
      </div>
    </BorderWithLabel>
  );
}
