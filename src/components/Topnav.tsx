import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
import { Button } from "./ui/button";
import { ProfileButton } from "./ProfileButton";

export default async function Topnav() {
  const { user } = await apiRsc();

  return (
    <div className="m-2 flex items-center justify-between">
      <Button asChild variant="outline">
        <Link href="/">Home</Link>
      </Button>
      <div>
        <ProfileButton user={user} />
      </div>
    </div>
  );
}
