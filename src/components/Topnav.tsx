import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
import { SigninButtons } from "./SigninButtons";
import { SignoutButton } from "./SignoutButton";
import { Button } from "./ui/button";

export default async function Topnav() {
  const { user } = await apiRsc();
  return user ? (
    <div className="m-2 flex justify-between">
      <HomeButton />
      <div className="flex items-center">
        <p className="mr-2">{user.name}</p>
        <SignoutButton>sign out</SignoutButton>
      </div>
    </div>
  ) : (
    <div className="m-2 flex justify-between">
      <div>
        <HomeButton />
      </div>
      <div className="flex items-center">
        <SigninButtons />
      </div>
    </div>
  );
}

function HomeButton() {
  return (
    <Button asChild variant="default">
      <Link href="/">Home</Link>
    </Button>
  );
}
