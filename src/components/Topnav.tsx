import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
import { SignoutButton } from "./SignoutButton";
import { Button } from "./ui/button";

export default async function Topnav() {
  const { user } = await apiRsc();

  return (
    <div className="m-2 flex justify-between">
      <Button asChild variant="primary">
        <Link href="/">Home</Link>
      </Button>
      <div className="flex items-center">
        {user && (
          <>
            <p className="mr-2">{user.name}</p>
            <SignoutButton>Sign out</SignoutButton>
          </>
        )}
      </div>
    </div>
  );
}
