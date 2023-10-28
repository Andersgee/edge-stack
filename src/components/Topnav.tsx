import { apiRsc } from "#src/trpc/api-rsc";
import { ProfileButton } from "./ProfileButton";

export default async function Topnav() {
  const { user } = await apiRsc();

  return (
    <div className="m-2 flex items-center justify-between">
      <div></div>
      {/*}
      <Button asChild variant="outline">
        <Link href="/">Home</Link>
      </Button>
  */}
      <div>
        <ProfileButton user={user} />
      </div>
    </div>
  );
}
